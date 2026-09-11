'use client'

import { useEffect, useRef, useState } from 'react'
import { livroPorId, stripHtml, type Verse } from '@/lib/bible'
import {
  alternarMarcacao,
  buscarMarcacao,
  chaveDaMarcacao,
  observarMarcacoes,
  salvarAnotacao,
  type Marcacao,
} from '@/lib/marcacoes'

export default function ListaVersiculos({
  versiculos,
  traducao,
  livro,
  capitulo,
}: {
  versiculos: Verse[]
  traducao: string
  livro: number
  capitulo: number
}) {
  const [marcacoesDoCapitulo, setMarcacoesDoCapitulo] = useState<
    Record<number, Marcacao | undefined>
  >({})
  /** Numero do versiculo copiado por ultimo — vira ✓ por um instante. */
  const [copiado, setCopiado] = useState<number | null>(null)
  const [podeCompartilhar, setPodeCompartilhar] = useState(false)
  /** Numero do versiculo com o editor de anotacao aberto. */
  const [anotando, setAnotando] = useState<number | null>(null)

  useEffect(() => {
    const atualizar = () => {
      const mapa: Record<number, Marcacao | undefined> = {}
      for (const v of versiculos) {
        mapa[v.number] = buscarMarcacao(livro, capitulo, v.number)
      }
      setMarcacoesDoCapitulo(mapa)
    }
    atualizar()
    return observarMarcacoes(atualizar)
  }, [livro, capitulo, versiculos])

  useEffect(() => {
    setPodeCompartilhar(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  const nomeDoLivro = livroPorId(livro)?.nome ?? `Livro ${livro}`

  async function copiar(versiculo: Verse) {
    const texto = formatarParaCompartilhar({
      livro: nomeDoLivro,
      capitulo,
      versiculo: versiculo.number,
      traducao,
      html: versiculo.html,
    })
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(versiculo.number)
      window.setTimeout(() => {
        setCopiado((atual) => (atual === versiculo.number ? null : atual))
      }, 1500)
    } catch {
      // navegadores antigos ou sem permissao: sem feedback e melhor que erro na tela.
    }
  }

  async function compartilhar(versiculo: Verse) {
    const referencia = `${nomeDoLivro} ${capitulo}:${versiculo.number}`
    const texto = formatarParaCompartilhar({
      livro: nomeDoLivro,
      capitulo,
      versiculo: versiculo.number,
      traducao,
      html: versiculo.html,
    })
    const url = `${window.location.origin}/biblia/${traducao}/${livro}/${capitulo}#v${versiculo.number}`
    try {
      await navigator.share({ title: referencia, text: texto, url })
    } catch (erro) {
      if ((erro as Error).name !== 'AbortError') {
        copiar(versiculo)
      }
    }
  }

  return (
    <article className="leitura-texto mt-6 space-y-2 font-serif">
      {versiculos.map((versiculo) => {
        const marcacao = marcacoesDoCapitulo[versiculo.number]
        const marcado = !!marcacao
        const foiCopiado = copiado === versiculo.number
        const editando = anotando === versiculo.number
        return (
          <p
            key={versiculo.number}
            id={`v${versiculo.number}`}
            className={`group flex scroll-mt-6 flex-wrap items-start gap-x-3 gap-y-2 rounded-md px-2 py-1 transition-colors target:bg-accent-soft ${
              marcado ? 'bg-accent-soft' : ''
            }`}
          >
            <button
              type="button"
              title={marcado ? 'Remover marcação' : 'Marcar versículo'}
              onClick={() =>
                alternarMarcacao({
                  livro,
                  capitulo,
                  versiculo: versiculo.number,
                  traducao,
                  html: versiculo.html,
                  marcadoEm: new Date().toISOString(),
                })
              }
              className={`relative w-7 shrink-0 self-start pt-1.5 text-right font-sans text-xs after:absolute after:-inset-x-2 after:-inset-y-3 after:content-[''] ${
                marcado ? 'text-accent' : 'text-muted hover:text-accent'
              }`}
            >
              {versiculo.number}
            </button>

            {/* Sanitizado em lib/bible/sanitize.ts: só <i> e <mark> sobrevivem. */}
            <span
              className="min-w-0 flex-1"
              dangerouslySetInnerHTML={{ __html: versiculo.html }}
            />

            <div className="flex shrink-0 self-start gap-0.5">
              <BotaoIcone
                onClick={() =>
                  setAnotando((atual) =>
                    atual === versiculo.number ? null : versiculo.number,
                  )
                }
                aria-label={`Anotar ${nomeDoLivro} ${capitulo}:${versiculo.number}`}
                title={marcacao?.anotacao ? 'Editar anotação' : 'Anotar'}
                destacado={!!marcacao?.anotacao || editando}
              >
                <IconeNota preenchido={!!marcacao?.anotacao} />
              </BotaoIcone>
              {podeCompartilhar && (
                <BotaoIcone
                  onClick={() => compartilhar(versiculo)}
                  aria-label={`Compartilhar ${nomeDoLivro} ${capitulo}:${versiculo.number}`}
                  title="Compartilhar"
                >
                  <IconeCompartilhar />
                </BotaoIcone>
              )}
              <BotaoIcone
                onClick={() => copiar(versiculo)}
                aria-label={`Copiar ${nomeDoLivro} ${capitulo}:${versiculo.number}`}
                title={foiCopiado ? 'Copiado!' : 'Copiar com referência'}
                destacado={foiCopiado}
              >
                {foiCopiado ? <IconeCheck /> : <IconeCopiar />}
              </BotaoIcone>
            </div>

            {marcacao?.anotacao && !editando && (
              <p className="mt-1 basis-full pl-10 font-sans text-sm italic text-muted">
                “{marcacao.anotacao}”
              </p>
            )}

            {editando && (
              <EditorAnotacao
                inicial={marcacao?.anotacao ?? ''}
                onCancelar={() => setAnotando(null)}
                onSalvar={(texto) => {
                  salvarAnotacao(
                    {
                      livro,
                      capitulo,
                      versiculo: versiculo.number,
                      traducao,
                      html: versiculo.html,
                    },
                    texto,
                  )
                  setAnotando(null)
                }}
              />
            )}
          </p>
        )
      })}
    </article>
  )
}

function EditorAnotacao({
  inicial,
  onSalvar,
  onCancelar,
}: {
  inicial: string
  onSalvar: (texto: string) => void
  onCancelar: () => void
}) {
  const [texto, setTexto] = useState(inicial)
  const areaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    areaRef.current?.focus()
    areaRef.current?.setSelectionRange(texto.length, texto.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mt-2 basis-full pl-10 font-sans">
      <textarea
        ref={areaRef}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onCancelar()
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onSalvar(texto)
        }}
        placeholder="Sua anotação sobre este versículo…"
        rows={3}
        maxLength={2000}
        className="w-full rounded-md border border-borda bg-surface p-2 text-sm focus:border-accent focus:outline-none"
      />
      <div className="mt-2 flex justify-end gap-2 text-sm">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-md px-3 py-1 text-muted hover:text-foreground"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => onSalvar(texto)}
          className="rounded-md bg-accent px-3 py-1 font-medium text-background"
        >
          Salvar
        </button>
      </div>
    </div>
  )
}

/**
 * Formato pensado para colar em WhatsApp/Notas/redes: texto entre aspas,
 * seguido da referencia. `stripHtml` remove <i>/<mark>, mantendo so o texto.
 */
function formatarParaCompartilhar({
  livro,
  capitulo,
  versiculo,
  traducao,
  html,
}: {
  livro: string
  capitulo: number
  versiculo: number
  traducao: string
  html: string
}): string {
  const texto = stripHtml(html)
  return `"${texto}" — ${livro} ${capitulo}:${versiculo} (${traducao})`
}

function BotaoIcone({
  onClick,
  children,
  destacado = false,
  ...aria
}: {
  onClick: () => void
  children: React.ReactNode
  destacado?: boolean
  'aria-label': string
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      {...aria}
      className={`rounded p-1.5 font-sans transition-opacity hover:text-accent hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent
        ${
          destacado
            ? 'text-accent opacity-100'
            : 'text-muted opacity-60 sm:opacity-0 sm:group-hover:opacity-60'
        }`}
    >
      {children}
    </button>
  )
}

function IconeCopiar() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function IconeCheck() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconeCompartilhar() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function IconeNota({ preenchido }: { preenchido: boolean }) {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={preenchido ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}
