'use client'

import { requestPasswordRecovery } from '@netlify/identity'
import Link from 'next/link'
import { useState } from 'react'

export default function RecuperarSenha() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function aoEnviar(evento: React.FormEvent) {
    evento.preventDefault()
    setEnviando(true)
    try {
      await requestPasswordRecovery(email)
    } catch {
      // Ignorado de proposito: responder diferente para email cadastrado e
      // nao cadastrado entregaria quem tem conta aqui.
    } finally {
      setEnviando(false)
      setEnviado(true)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-14">
      <h1 className="font-serif text-3xl font-semibold">Recuperar senha</h1>

      {enviado ? (
        <>
          <p className="mt-3 text-muted">
            Se existe uma conta com <strong>{email}</strong>, o link para criar
            uma senha nova já está a caminho. Ele vale por pouco tempo e só
            pode ser usado uma vez.
          </p>
          <p className="mt-3 text-sm text-muted">
            Não chegou? Confira o spam antes de pedir outro.
          </p>
        </>
      ) : (
        <>
          <p className="mt-3 text-muted">
            Informe o email da conta e enviaremos um link para definir uma
            senha nova.
          </p>

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

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-background disabled:opacity-60"
            >
              {enviando ? 'Enviando…' : 'Enviar link'}
            </button>
          </form>
        </>
      )}

      <Link
        href="/entrar"
        className="mt-8 inline-block text-sm text-muted hover:text-foreground"
      >
        ← Voltar para o acesso
      </Link>
    </div>
  )
}
