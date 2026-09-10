'use client'

import { updateUser } from '@netlify/identity'
import Link from 'next/link'
import { useState } from 'react'
import { useSessao } from '@/components/provedor-sessao'

const SENHA_MIN = 8

/**
 * Fim do fluxo de recuperacao. Quem chega aqui veio do link do email: o
 * `handleAuthCallback` no provedor de sessao ja trocou o token por uma sessao
 * valida, entao o usuario esta logado — so falta gravar a senha nova.
 */
export default function NovaSenha() {
  const { usuario, carregando } = useSessao()
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)

  async function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault()
    setErro(null)

    if (senha.length < SENHA_MIN) {
      setErro(`A senha precisa ter pelo menos ${SENHA_MIN} caracteres.`)
      return
    }
    if (senha !== confirmacao) {
      setErro('As duas senhas não são iguais.')
      return
    }

    setSalvando(true)
    try {
      await updateUser({ password: senha })
      // Navegacao completa e obrigatoria aqui: router.push() faz navegacao
      // suave e o cookie de sessao recem-escrito nao chegaria ao servidor.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = '/'
    } catch {
      setErro(
        'Não foi possível salvar a senha. O link pode ter expirado — peça outro.',
      )
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div className="mx-auto max-w-md px-6 py-14" aria-busy="true">
        <div className="h-9 w-48 animate-pulse rounded-md bg-accent-soft/60" />
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="mx-auto max-w-md px-6 py-14">
        <h1 className="font-serif text-3xl font-semibold">Nova senha</h1>
        <p className="mt-3 text-muted">
          Esta tela só abre a partir do link enviado por email, e o link já não
          está valendo. Peça outro para continuar.
        </p>
        <Link
          href="/recuperar-senha"
          className="mt-8 inline-block text-sm text-accent hover:underline"
        >
          Pedir outro link
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-6 py-14">
      <h1 className="font-serif text-3xl font-semibold">Nova senha</h1>
      <p className="mt-3 text-muted">
        Definindo a senha da conta <strong>{usuario.email}</strong>.
      </p>

      <form onSubmit={aoEnviar} className="mt-6 space-y-4" noValidate>
        <label className="block">
          <span className="text-sm font-medium">Nova senha</span>
          <input
            type="password"
            required
            minLength={SENHA_MIN}
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 w-full rounded-md border border-borda bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
          <span className="mt-1 block text-xs text-muted">
            Mínimo de {SENHA_MIN} caracteres.
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Repita a nova senha</span>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            className="mt-1 w-full rounded-md border border-borda bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </label>

        {erro && (
          <p
            role="alert"
            className="rounded-md border border-borda bg-accent-soft/40 p-3 text-sm"
          >
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={salvando}
          className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-background disabled:opacity-60"
        >
          {salvando ? 'Salvando…' : 'Salvar senha'}
        </button>
      </form>
    </div>
  )
}
