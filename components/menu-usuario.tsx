'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

export default function MenuUsuario() {
  const { data: sessao, status } = useSession()
  const [aberto, setAberto] = useState(false)

  if (status === 'loading') {
    return <div className="h-8 w-16 animate-pulse rounded-md bg-accent-soft/60" />
  }

  if (status !== 'authenticated' || !sessao?.user) {
    return (
      <Link
        href="/entrar"
        className="rounded-md border border-borda px-3 py-1.5 text-sm hover:border-accent"
      >
        Entrar
      </Link>
    )
  }

  const email = sessao.user.email ?? 'Você'
  const inicial = email.slice(0, 1).toUpperCase()
  const rotulo = email.split('@')[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={aberto}
        className="flex items-center gap-2 rounded-full border border-borda p-1 pr-3 hover:border-accent"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-accent-soft text-xs text-accent">
          {inicial}
        </span>
        <span className="max-w-32 truncate text-sm">{rotulo}</span>
      </button>

      {aberto && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-lg border border-borda bg-surface p-2 shadow-md"
          onMouseLeave={() => setAberto(false)}
        >
          <p className="truncate px-2 py-1 text-xs text-muted">
            {sessao.user.email}
          </p>
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut()}
            className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent-soft"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
