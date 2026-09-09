'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
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
  const { data: sessao, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && sessao?.user?.id) {
      sincronizarInicial(sessao.user.id).catch((erro) => {
        console.warn('Falha na sincronização inicial:', erro)
      })
    } else if (status === 'unauthenticated') {
      limparMarcadorSincronizacao()
    }
  }, [status, sessao?.user?.id])

  return null
}
