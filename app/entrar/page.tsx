'use client'

import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Entrar() {
  const { status } = useSession()
  const params = useSearchParams()
  const paraOnde = params.get('callbackUrl') ?? '/'

  useEffect(() => {
    if (status === 'authenticated') {
      window.location.href = paraOnde
    }
  }, [status, paraOnde])

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold">Entrar</h1>
      <p className="mt-3 text-muted">
        Entrar sincroniza seus planos e marcações entre dispositivos. Você pode
        continuar usando o site sem entrar — os dados ficam apenas neste
        navegador.
      </p>

      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: paraOnde })}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-md border border-borda bg-surface px-4 py-3 text-sm font-medium hover:border-accent"
      >
        <svg
          aria-hidden
          width="18"
          height="18"
          viewBox="0 0 48 48"
          className="shrink-0"
        >
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.7 32.5 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 4.9 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 4.9 29.3 3 24 3 16.1 3 9.3 7.6 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 45c5.3 0 10.1-1.8 13.9-4.9l-6.4-5.4c-2 1.4-4.6 2.3-7.5 2.3-5.3 0-9.7-2.5-11.3-7l-6.5 5C9.2 40.4 16 45 24 45z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.8-3.9 5.1l6.4 5.4C41.8 34.9 45 30 45 24c0-1.2-.1-2.4-.4-3.5z"
          />
        </svg>
        Entrar com Google
      </button>

      <Link
        href="/"
        className="mt-8 inline-block text-sm text-muted hover:text-foreground"
      >
        ← Voltar
      </Link>
    </div>
  )
}
