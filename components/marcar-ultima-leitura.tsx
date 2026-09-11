'use client'

import { useEffect } from 'react'
import { gravarUltimaLeitura } from '@/lib/ultima-leitura'

/**
 * Renderiza null. Ao montar num capitulo, registra a visita no localStorage
 * para a home poder oferecer "continuar de onde parei".
 */
export default function MarcarUltimaLeitura({
  traducao,
  livro,
  capitulo,
}: {
  traducao: string
  livro: number
  capitulo: number
}) {
  useEffect(() => {
    gravarUltimaLeitura({ traducao, livro, capitulo })
  }, [traducao, livro, capitulo])

  return null
}
