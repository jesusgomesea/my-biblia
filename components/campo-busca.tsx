'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CampoBusca({
  traducao,
  inicial = '',
}: {
  traducao: string
  inicial?: string
}) {
  const router = useRouter()
  const [termo, setTermo] = useState(inicial)

  return (
    <form
      onSubmit={(evento) => {
        evento.preventDefault()
        if (!termo.trim()) return
        router.push(
          `/busca?q=${encodeURIComponent(termo.trim())}&traducao=${traducao}`,
        )
      }}
      role="search"
    >
      <input
        type="search"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="João 3:16 ou uma palavra"
        aria-label="Buscar na Bíblia"
        className="w-full rounded-md border border-borda bg-surface px-3 py-1.5 text-sm sm:w-64"
      />
    </form>
  )
}
