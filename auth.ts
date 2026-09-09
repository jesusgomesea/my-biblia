import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { verificarSenha } from '@/lib/dados/contas'

/**
 * Auth.js v5 com login por email + senha próprio. Sessão em cookie JWT.
 * As contas ficam no Netlify Blobs (store `contas`, ver lib/dados/contas.ts).
 *
 * `trustHost: true` é preciso no Netlify — a v5 não considera o host de
 * produção confiável automaticamente.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Email e senha',
      credentials: {
        email: { label: 'Email', type: 'email' },
        senha: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '')
        const senha = String(credentials?.senha ?? '')
        const conta = await verificarSenha(email, senha)
        if (!conta) return null
        return { id: conta.id, email: conta.email }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.userId = user.id
      return token
    },
    async session({ session, token }) {
      if (token.userId && session.user) {
        session.user.id = token.userId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/entrar',
  },
})
