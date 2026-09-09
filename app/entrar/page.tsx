'use client'

import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Modo = 'entrar' | 'cadastrar'

export default function Entrar() {
  const { status } = useSession()
  const params = useSearchParams()
  const paraOnde = params.get('callbackUrl') ?? '/'

  const [modo, setModo] = useState<Modo>('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      window.location.href = paraOnde
    }
  }, [status, paraOnde])

  async function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault()
    setErro(null)
    setEnviando(true)

    try {
      if (modo === 'cadastrar') {
        const resposta = await fetch('/api/auth/cadastro', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email, senha }),
        })
        if (!resposta.ok) {
          const { erro } = await resposta
            .json()
            .catch(() => ({ erro: 'Falha ao criar conta.' }))
          setErro(erro)
          return
        }
      }

      const resultado = await signIn('credentials', {
        email,
        senha,
        redirect: false,
      })

      if (resultado?.error) {
        setErro(
          modo === 'cadastrar'
            ? 'Conta criada, mas não conseguimos entrar. Tente entrar manualmente.'
            : 'Email ou senha incorretos.',
        )
        return
      }

      window.location.href = paraOnde
    } catch {
      setErro('Falha inesperada. Tente de novo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-14">
      <h1 className="font-serif text-3xl font-semibold">
        {modo === 'entrar' ? 'Entrar' : 'Criar conta'}
      </h1>
      <p className="mt-3 text-muted">
        {modo === 'entrar'
          ? 'Entrar sincroniza seus planos e marcações entre dispositivos.'
          : 'Basta um email e uma senha — sem verificação por email.'}
        Você pode continuar usando o site sem entrar; os dados ficam apenas
        neste navegador.
      </p>

      <div
        role="tablist"
        aria-label="Modo de acesso"
        className="mt-6 flex rounded-md border border-borda p-1"
      >
        {(['entrar', 'cadastrar'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={modo === m}
            onClick={() => {
              setModo(m)
              setErro(null)
            }}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm ${
              modo === m
                ? 'bg-accent text-background'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {m === 'entrar' ? 'Entrar' : 'Criar conta'}
          </button>
        ))}
      </div>

      <form onSubmit={aoEnviar} className="mt-6 space-y-4" noValidate>
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-borda bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Senha</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 w-full rounded-md border border-borda bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
          {modo === 'cadastrar' && (
            <span className="mt-1 block text-xs text-muted">
              Mínimo de 8 caracteres.
            </span>
          )}
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
          disabled={enviando}
          className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-background disabled:opacity-60"
        >
          {enviando
            ? 'Aguarde…'
            : modo === 'entrar'
              ? 'Entrar'
              : 'Criar conta e entrar'}
        </button>
      </form>

      <Link
        href="/"
        className="mt-8 inline-block text-sm text-muted hover:text-foreground"
      >
        ← Voltar
      </Link>
    </div>
  )
}
