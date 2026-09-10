'use client'

import {
  getUser,
  handleAuthCallback,
  onAuthChange,
  type User,
} from '@netlify/identity'
import { createContext, useContext, useEffect, useState } from 'react'

/**
 * Substitui o SessionProvider do next-auth. O Identity nao traz contexto de
 * React proprio: `getUser()` le a sessao (localStorage ou cookie `nf_jwt`) e
 * `onAuthChange` avisa das mudancas. Este provedor junta os dois num contexto
 * para que a arvore inteira leia a sessao de um lugar so.
 *
 * A resolucao continua no cliente, e nao no servidor, de proposito: chamar
 * `getUser()` num Server Component tornaria a pagina dinamica, e as telas de
 * leitura sao prerenderizadas por decisao de performance.
 */

type Sessao = {
  usuario: User | null
  /** `true` ate a primeira resposta de `getUser()`; evita piscar "Entrar". */
  carregando: boolean
}

const ContextoSessao = createContext<Sessao>({
  usuario: null,
  carregando: true,
})

export function useSessao(): Sessao {
  return useContext(ContextoSessao)
}

/**
 * Os links que o Identity manda por email (confirmacao de cadastro, troca de
 * senha, troca de email) voltam com o token no hash da URL, e podem cair em
 * qualquer pagina. Por isso o tratamento mora aqui no layout raiz, e nao numa
 * rota `/callback`.
 */
const HASH_DE_AUTENTICACAO =
  /^#(confirmation_token|recovery_token|invite_token|email_change_token|access_token)=/

function temTokenNoHash(): boolean {
  return (
    typeof window !== 'undefined' &&
    HASH_DE_AUTENTICACAO.test(window.location.hash)
  )
}

export default function ProvedorSessao({
  children,
}: {
  children: React.ReactNode
}) {
  const [usuario, setUsuario] = useState<User | null>(null)
  const [carregando, setCarregando] = useState(true)
  // Iniciado no primeiro render para nao mostrar a pagina por baixo do token.
  const [processandoLink, setProcessandoLink] = useState(temTokenNoHash)
  const [erroDoLink, setErroDoLink] = useState<string | null>(null)

  useEffect(() => {
    let vivo = true

    getUser()
      .then((u) => {
        if (!vivo) return
        setUsuario(u)
        setCarregando(false)
      })
      .catch(() => {
        // getUser nao lanca, mas se o Identity nao estiver ligado no projeto
        // o app precisa seguir funcionando so com o localStorage.
        if (vivo) setCarregando(false)
      })

    const cancelarAssinatura = onAuthChange((_evento, u) => setUsuario(u))

    return () => {
      vivo = false
      cancelarAssinatura()
    }
  }, [])

  useEffect(() => {
    if (!temTokenNoHash()) return

    handleAuthCallback()
      .then((resultado) => {
        if (!resultado) {
          setProcessandoLink(false)
          return
        }
        // Na recuperacao o usuario ja esta logado mas ainda sem senha nova.
        if (resultado.type === 'recovery') {
          // Navegacao completa e obrigatoria aqui: router.push() faz navegacao
          // suave e o cookie de sessao recem-escrito nao chegaria ao servidor.
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = '/nova-senha'
          return
        }
        // Navegacao completa e obrigatoria aqui: router.push() faz navegacao
        // suave e o cookie de sessao recem-escrito nao chegaria ao servidor.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = '/'
      })
      .catch((erro: unknown) => {
        setErroDoLink(
          erro instanceof Error
            ? erro.message
            : 'Nao foi possivel validar este link.',
        )
        setProcessandoLink(false)
      })
  }, [])

  if (erroDoLink) {
    return (
      <div className="mx-auto max-w-md px-6 py-14">
        <h1 className="font-serif text-2xl font-semibold">Link invalido</h1>
        <p className="mt-3 text-muted">{erroDoLink}</p>
        <p className="mt-3 text-sm text-muted">
          Links de email valem por pouco tempo e uma vez so. Peca outro na tela
          de acesso.
        </p>
        <a
          href="/entrar"
          className="mt-8 inline-block text-sm text-accent hover:underline"
        >
          Ir para a tela de acesso
        </a>
      </div>
    )
  }

  if (processandoLink) {
    return (
      <div className="mx-auto max-w-md px-6 py-14" aria-busy="true">
        <p className="text-muted">Validando o link…</p>
      </div>
    )
  }

  return (
    <ContextoSessao.Provider value={{ usuario, carregando }}>
      {children}
    </ContextoSessao.Provider>
  )
}
