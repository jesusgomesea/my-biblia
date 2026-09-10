'use client'

import { logout } from '@netlify/identity'
import Link from 'next/link'
import { useState } from 'react'
import { useSessao } from '@/components/provedor-sessao'

export default function MenuUsuario() {
  const { usuario, carregando } = useSessao()
  const [aberto, setAberto] = useState(false)

  if (carregando) {
    return <div className="h-8 w-16 animate-pulse rounded-md bg-accent-soft/60" />
  }

  if (!usuario) {
    return (
      <Link
        href="/entrar"
        className="rounded-md border border-borda px-3 py-1.5 text-sm hover:border-accent"
      >
        Entrar
      </Link>
    )
  }

  const email = usuario.email ?? 'Você'
  const inicial = email.slice(0, 1).toUpperCase()
  const rotulo = email.split('@')[0]

  async function sair() {
    try {
      await logout()
    } finally {
      // Recarrega a pagina inteira: o cookie nf_jwt so some do lado do
      // servidor na proxima requisicao completa.
      // Navegacao completa e obrigatoria aqui: router.push() faz navegacao
      // suave e o cookie de sessao recem-escrito nao chegaria ao servidor.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = '/'
    }
  }

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
          <p className="truncate px-2 py-1 text-xs text-muted">{usuario.email}</p>
          <button
            type="button"
            role="menuitem"
            onClick={() => void sair()}
            className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent-soft"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
