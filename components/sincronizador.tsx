'use client'

import { useEffect } from 'react'
import { useSessao } from '@/components/provedor-sessao'
import {
  limparMarcadorSincronizacao,
  sincronizarInicial,
} from '@/lib/dados/nuvem'

/**
 * Renderiza null. Fica ouvindo a sessão: quando o usuário loga, decide entre
 * baixar o snapshot da nuvem ou empurrar o que já existe no localStorage; ao
 * deslogar, esquece o marcador para que o próximo login refaça a sincronia.
 */
export default function Sincronizador() {
  const { usuario, carregando } = useSessao()
  const id = usuario?.id

  useEffect(() => {
    if (carregando) return

    if (id) {
      sincronizarInicial(id).catch((erro) => {
        console.warn('Falha na sincronização inicial:', erro)
      })
    } else {
      limparMarcadorSincronizacao()
    }
  }, [carregando, id])

  return null
}
