'use client'

import { useSession } from 'next-auth/react'
import { useState, useSyncExternalStore } from 'react'
import {
  enviar,
  limparMarcadorSincronizacao,
  sincronizarInicial,
} from '@/lib/dados/nuvem'
import type { Plano } from '@/lib/planos/tipos'
import type { Marcacao } from '@/lib/marcacoes'

type Espelho<T> = { valor: T; erro: string | null }

/**
 * O que esta pagina mostra mora no localStorage, um sistema externo: espelhar
 * isso com efeito + setState renderiza em cascata. `useSyncExternalStore` le
 * a chave sob demanda e reage aos mesmos eventos.
 *
 * O cache pelo texto cru nao e opcional: `JSON.parse` devolveria um objeto
 * novo a cada leitura e o React, que compara por identidade, renderizaria sem
 * parar. Enquanto o cru nao muda, devolvemos o mesmo objeto.
 */
function criarEspelho<T>(chave: string, vazio: T) {
  let cruAnterior: string | null | undefined
  let atual: Espelho<T> = { valor: vazio, erro: null }

  return function ler(): Espelho<T> {
    const cru = window.localStorage.getItem(chave)
    if (cru === cruAnterior) return atual
    cruAnterior = cru

    try {
      atual = { valor: cru ? (JSON.parse(cru) as T) : vazio, erro: null }
    } catch (erro) {
      atual = { valor: vazio, erro: (erro as Error).message }
    }
    return atual
  }
}

function criarAssinatura(evento: string) {
  return (aoMudar: () => void) => {
    window.addEventListener(evento, aoMudar)
    return () => window.removeEventListener(evento, aoMudar)
  }
}

const lerPlanos = criarEspelho<Plano[]>('my-biblia:planos', [])
const lerMarcacoes = criarEspelho<Record<string, Marcacao>>(
  'my-biblia:marcacoes',
  {},
)

const assinarPlanos = criarAssinatura('planos-alterados')
const assinarMarcacoes = criarAssinatura('marcacoes-alteradas')

// No servidor nao ha localStorage. Os dois precisam ser constantes: o React
// exige a mesma referencia a cada chamada.
const PLANOS_NO_SERVIDOR: Espelho<Plano[]> = { valor: [], erro: null }
const MARCACOES_NO_SERVIDOR: Espelho<Record<string, Marcacao>> = {
  valor: {},
  erro: null,
}

/**
 * Pagina de bastidores para inspecionar e mexer no estado do app durante o
 * desenvolvimento. Nao esta linkada no menu; entra-se por URL direta.
 */
export default function DevProg() {
  const { data: sessao, status } = useSession()
  const [saida, setSaida] = useState<string>('')

  const { valor: planos, erro: erroPlanos } = useSyncExternalStore(
    assinarPlanos,
    lerPlanos,
    () => PLANOS_NO_SERVIDOR,
  )
  const { valor: marcacoes, erro: erroMarcacoes } = useSyncExternalStore(
    assinarMarcacoes,
    lerMarcacoes,
    () => MARCACOES_NO_SERVIDOR,
  )

  function anotar(rotulo: string, valor: unknown) {
    const stamp = new Date().toISOString().slice(11, 19)
    setSaida(
      (atual) =>
        `[${stamp}] ${rotulo}:\n${
          typeof valor === 'string' ? valor : JSON.stringify(valor, null, 2)
        }\n\n${atual}`,
    )
  }

  async function pingar(url: string) {
    try {
      const inicio = performance.now()
      const resposta = await fetch(url, { credentials: 'include' })
      const ms = Math.round(performance.now() - inicio)
      const corpo = resposta.headers
        .get('content-type')
        ?.includes('application/json')
        ? await resposta.json().catch(() => null)
        : await resposta.text().catch(() => null)
      anotar(`${resposta.status} ${url} (${ms}ms)`, corpo)
    } catch (erro) {
      anotar(`ERR ${url}`, (erro as Error).message)
    }
  }

  function semearPlano() {
    const cru = window.localStorage.getItem('my-biblia:planos')
    const lista = cru ? (JSON.parse(cru) as Plano[]) : []
    const plano: Plano = {
      id: crypto.randomUUID(),
      titulo: 'Plano semeado por /devprog',
      resumo: 'Fixture para testes manuais.',
      temas: ['debug'],
      dias: 2,
      minutosPorDia: 10,
      traducao: 'NVT',
      criadoEm: new Date().toISOString(),
      concluidos: [],
      roteiro: [
        {
          dia: 1,
          foco: 'Primeiro dia',
          reflexao: 'Está aparecendo?',
          leituras: [
            { livro: 1, capitulo: 1, versiculoInicio: 1, versiculoFim: 3 },
          ],
        },
        {
          dia: 2,
          foco: 'Segundo dia',
          reflexao: 'Marcado como concluído?',
          leituras: [
            { livro: 43, capitulo: 3, versiculoInicio: 16, versiculoFim: 16 },
          ],
        },
      ],
    }
    window.localStorage.setItem(
      'my-biblia:planos',
      JSON.stringify([...lista, plano]),
    )
    window.dispatchEvent(new Event('planos-alterados'))
    anotar('Plano semeado', plano.id)
  }

  function limparPlanos() {
    window.localStorage.removeItem('my-biblia:planos')
    window.dispatchEvent(new Event('planos-alterados'))
    anotar('localStorage', 'my-biblia:planos removido')
  }

  function limparMarcacoes() {
    window.localStorage.removeItem('my-biblia:marcacoes')
    window.dispatchEvent(new Event('marcacoes-alteradas'))
    anotar('localStorage', 'my-biblia:marcacoes removido')
  }

  function limparTudo() {
    for (const chave of Object.keys(window.localStorage)) {
      if (chave.startsWith('my-biblia:')) window.localStorage.removeItem(chave)
    }
    window.dispatchEvent(new Event('planos-alterados'))
    window.dispatchEvent(new Event('marcacoes-alteradas'))
    anotar('localStorage', 'todas as chaves my-biblia:* removidas')
  }

  async function forcarSincInicial() {
    if (!sessao?.user?.id) {
      anotar('sincronizarInicial', 'nao ha sessao')
      return
    }
    limparMarcadorSincronizacao()
    try {
      await sincronizarInicial(sessao.user.id)
      anotar('sincronizarInicial', 'ok')
    } catch (erro) {
      anotar('sincronizarInicial', (erro as Error).message)
    }
  }

  async function forcarEnvio() {
    try {
      await enviar({ planos, marcacoes })
      anotar('PUT /api/dados', 'ok')
    } catch (erro) {
      anotar('PUT /api/dados', (erro as Error).message)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8 border-b border-borda pb-4">
        <p className="text-xs uppercase tracking-wider text-accent">
          Bastidores
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold">/devprog</h1>
        <p className="mt-2 text-sm text-muted">
          Pagina de inspecao e depuracao. Nao esta no menu; use pela URL.
        </p>
      </header>

      <Secao titulo="Sessao">
        <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted">status</dt>
          <dd>{status}</dd>
          <dt className="text-muted">id</dt>
          <dd className="truncate font-mono text-xs">
            {sessao?.user?.id ?? '—'}
          </dd>
          <dt className="text-muted">email</dt>
          <dd>{sessao?.user?.email ?? '—'}</dd>
        </dl>
      </Secao>

      <Secao titulo={`Planos (${planos.length})`}>
        <ErroLeitura chave="my-biblia:planos" mensagem={erroPlanos} />
        <pre className="max-h-64 overflow-auto rounded-md bg-accent-soft/40 p-3 text-xs">
          {JSON.stringify(planos, null, 2)}
        </pre>
        <div className="mt-3 flex flex-wrap gap-2">
          <Botao onClick={semearPlano}>Semear plano</Botao>
          <Botao onClick={limparPlanos} variant="risco">
            Limpar planos
          </Botao>
        </div>
      </Secao>

      <Secao titulo={`Marcacoes (${Object.keys(marcacoes).length})`}>
        <ErroLeitura chave="my-biblia:marcacoes" mensagem={erroMarcacoes} />
        <pre className="max-h-64 overflow-auto rounded-md bg-accent-soft/40 p-3 text-xs">
          {JSON.stringify(marcacoes, null, 2)}
        </pre>
        <div className="mt-3">
          <Botao onClick={limparMarcacoes} variant="risco">
            Limpar marcacoes
          </Botao>
        </div>
      </Secao>

      <Secao titulo="Sincronizacao com a nuvem">
        <p className="text-sm text-muted">
          Depende de estar logado. Sem sessao, tudo aqui devolve 401
          silenciosamente.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Botao onClick={forcarSincInicial}>Forcar sinc inicial</Botao>
          <Botao onClick={forcarEnvio}>PUT snapshot atual</Botao>
          <Botao onClick={() => pingar('/api/dados')}>GET /api/dados</Botao>
        </div>
      </Secao>

      <Secao titulo="Pings">
        <div className="flex flex-wrap gap-2">
          <Botao onClick={() => pingar('/api/auth/session')}>
            /api/auth/session
          </Botao>
          <Botao onClick={() => pingar('/manifest.webmanifest')}>
            /manifest.webmanifest
          </Botao>
        </div>
      </Secao>

      <Secao titulo="Zerar tudo">
        <p className="text-sm text-muted">
          Remove todas as chaves <code>my-biblia:*</code> deste navegador.
          Nao mexe no servidor.
        </p>
        <div className="mt-3">
          <Botao onClick={limparTudo} variant="risco">
            Zerar localStorage
          </Botao>
        </div>
      </Secao>

      <Secao titulo="Saida">
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-accent-soft/40 p-3 text-xs">
          {saida || '(vazio)'}
        </pre>
        <div className="mt-3">
          <Botao onClick={() => setSaida('')}>Limpar saida</Botao>
        </div>
      </Secao>
    </div>
  )
}

function Secao({
  titulo,
  children,
}: {
  titulo: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-8 rounded-lg border border-borda bg-surface p-4">
      <h2 className="mb-3 font-serif text-lg font-semibold">{titulo}</h2>
      {children}
    </section>
  )
}

function ErroLeitura({
  chave,
  mensagem,
}: {
  chave: string
  mensagem: string | null
}) {
  if (!mensagem) return null
  return (
    <p role="alert" className="mb-3 text-xs text-red-400">
      JSON invalido em <code>{chave}</code>: {mensagem}. Mostrando vazio.
    </p>
  )
}

function Botao({
  onClick,
  children,
  variant = 'padrao',
}: {
  onClick: () => void | Promise<void>
  children: React.ReactNode
  variant?: 'padrao' | 'risco'
}) {
  const cor =
    variant === 'risco'
      ? 'border-borda hover:border-red-400 hover:text-red-400'
      : 'border-borda hover:border-accent'
  return (
    <button
      type="button"
      onClick={() => void onClick()}
      className={`rounded-md border px-3 py-1.5 text-sm ${cor}`}
    >
      {children}
    </button>
  )
}
