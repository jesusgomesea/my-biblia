import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

/**
 * Auth.js v5. Sessão em cookie JWT (sem banco), com o id do Google usado
 * como chave dos dados do usuário no Netlify Blobs.
 *
 * `trustHost: true` é necessário no Netlify porque o host de produção não é
 * automaticamente considerado confiável — a v5 exige isso explicitamente.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [Google],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Na primeira autenticação, guardamos o id estável do Google.
      if (account?.provider === 'google' && profile?.sub) {
        token.userId = profile.sub
      }
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
