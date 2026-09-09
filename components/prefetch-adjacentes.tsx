'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Assim que o capítulo aparece, disparamos o prefetch dos vizinhos. Como o
 * fetch ao Bolls.life fica em cache por 7 dias no servidor, o próximo clique
 * em "Próximo capítulo" cai em cache quente e responde na hora, mesmo que o
 * usuário nem role até o link no rodapé.
 */
export default function PrefetchAdjacentes({
  urls,
}: {
  urls: (string | null)[]
}) {
  const router = useRouter()

  useEffect(() => {
    for (const url of urls) {
      if (url) router.prefetch(url)
    }
  }, [router, urls])

  return null
}
