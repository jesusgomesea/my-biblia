import Link from 'next/link'
import { notFound } from 'next/navigation'
import SeletorComparacao from '@/components/seletor-comparacao'
import { bible, livroPorId, TRADUCAO_PADRAO, type Verse } from '@/lib/bible'

const MAX_COLUNAS = 4

/** Filtra o parametro `t` da URL, aceitando so ids da fonte externa. */
function parsearTraducoes(cru: string | string[] | undefined): string[] {
  const bruto = Array.isArray(cru) ? cru.join(',') : (cru ?? '')
  const validas = bruto
    .split(',')
    .map((t) => t.trim())
    .filter((t) => /^[A-Za-z0-9_-]{1,20}$/.test(t))
  const unicas = Array.from(new Set(validas)).slice(0, MAX_COLUNAS)
  return unicas.length > 0 ? unicas : [TRADUCAO_PADRAO]
}

async function fetchColuna(
  traducao: string,
  livro: number,
  capitulo: number,
): Promise<Verse[] | null> {
  try {
    return await bible.getChapter(traducao, livro, capitulo)
  } catch {
    return null
  }
}

export default async function Comparar(
  props: PageProps<'/comparar/[livro]/[capitulo]'>,
) {
  const { livro, capitulo } = await props.params
  const searchParams = await props.searchParams
  const idLivro = Number(livro)
  const numCapitulo = Number(capitulo)
  if (!Number.isInteger(idLivro) || !Number.isInteger(numCapitulo)) notFound()

  const nomeLivro = livroPorId(idLivro)?.nome
  if (!nomeLivro) notFound()

  const traducoes = parsearTraducoes(searchParams.t)
  const [linguas, ...colunas] = await Promise.all([
    bible.listLanguages(),
    ...traducoes.map((t) => fetchColuna(t, idLivro, numCapitulo)),
  ])

  // Uniao dos numeros de versiculo entre todas as traducoes: algumas nao
  // trazem todos (ex.: NT-only ou variacoes textuais).
  const numeros = Array.from(
    new Set(colunas.flatMap((v) => v?.map((x) => x.number) ?? [])),
  ).sort((a, b) => a - b)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-accent">
            Comparar traduções
          </p>
          <h1 className="mt-1 font-serif text-2xl font-semibold">
            {nomeLivro}{' '}
            <span className="text-accent">{numCapitulo}</span>
          </h1>
        </div>
        <Link
          href={`/biblia/${traducoes[0]}/${idLivro}/${numCapitulo}`}
          className="text-sm text-accent hover:underline"
        >
          Voltar à leitura →
        </Link>
      </div>

      <SeletorComparacao
        linguas={linguas}
        livro={idLivro}
        capitulo={numCapitulo}
        traducoes={traducoes}
        max={MAX_COLUNAS}
      />

      {numeros.length === 0 ? (
        <p className="mt-8 text-muted">
          Nenhuma das traduções escolhidas tem este capítulo. Tente outras.
        </p>
      ) : (
        <div
          className="mt-6 grid gap-4 overflow-x-auto"
          style={{
            gridTemplateColumns: `repeat(${traducoes.length}, minmax(240px, 1fr))`,
          }}
        >
          {traducoes.map((t, i) => (
            <Coluna
              key={t}
              traducao={t}
              versiculos={colunas[i]}
              numeros={numeros}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Coluna({
  traducao,
  versiculos,
  numeros,
}: {
  traducao: string
  versiculos: Verse[] | null
  numeros: number[]
}) {
  const mapa = new Map<number, Verse>(versiculos?.map((v) => [v.number, v]))
  return (
    <section className="min-w-0">
      <header className="mb-3 border-b border-borda pb-2">
        <p className="font-serif text-sm font-semibold text-accent">
          {traducao}
        </p>
      </header>

      {versiculos === null ? (
        <p className="text-sm text-muted">
          Não foi possível carregar esta tradução.
        </p>
      ) : (
        <div className="space-y-3 font-serif text-base/7">
          {numeros.map((n) => {
            const v = mapa.get(n)
            return (
              <p key={n} className="flex gap-2">
                <span className="w-6 shrink-0 pt-1 text-right font-sans text-xs text-muted">
                  {n}
                </span>
                {v ? (
                  /* Sanitizado em lib/bible/sanitize.ts. */
                  <span dangerouslySetInnerHTML={{ __html: v.html }} />
                ) : (
                  <span className="italic text-muted">—</span>
                )}
              </p>
            )
          })}
        </div>
      )}
    </section>
  )
}
