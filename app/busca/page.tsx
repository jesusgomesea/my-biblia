import Link from 'next/link'
import { redirect } from 'next/navigation'
import CampoBusca from '@/components/campo-busca'
import { bible, lerReferencia, livroPorId, TRADUCAO_PADRAO } from '@/lib/bible'

export default async function Busca(props: PageProps<'/busca'>) {
  const parametros = await props.searchParams
  const termo = typeof parametros.q === 'string' ? parametros.q : ''
  const traducao =
    typeof parametros.traducao === 'string' && parametros.traducao
      ? parametros.traducao
      : TRADUCAO_PADRAO

  const referencia = termo ? lerReferencia(termo) : null
  if (referencia) {
    const ancora = referencia.versiculo ? `#v${referencia.versiculo}` : ''
    redirect(
      `/biblia/${traducao}/${referencia.livro}/${referencia.capitulo}${ancora}`,
    )
  }

  const resultados = termo ? await bible.search(traducao, termo) : null

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold">Buscar</h1>
      <p className="mt-2 text-sm text-muted">
        Digite uma referência como <em>João 3:16</em> para ir direto ao trecho,
        ou uma palavra para procurar no texto de {traducao}.
      </p>

      <div className="mt-5 max-w-md">
        <CampoBusca traducao={traducao} inicial={termo} />
      </div>

      {resultados && (
        <>
          <p className="mt-8 text-sm text-muted">
            {resultados.hits.length === 0
              ? 'Nenhum versículo encontrado.'
              : `${resultados.hits.length} versículos${
                  resultados.truncado ? ' (há mais além destes)' : ''
                }.`}
          </p>

          <ul className="mt-4 space-y-3">
            {resultados.hits.map((achado) => (
              <li
                key={`${achado.book}:${achado.chapter}:${achado.verse}`}
                className="rounded-lg border border-borda bg-surface p-4"
              >
                <Link
                  href={`/biblia/${traducao}/${achado.book}/${achado.chapter}#v${achado.verse}`}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  {livroPorId(achado.book)?.nome} {achado.chapter}:{achado.verse}
                </Link>
                {/* Sanitizado em lib/bible/sanitize.ts: o <mark> é da própria fonte. */}
                <p
                  className="mt-1.5 font-serif text-base/7 [&_mark]:bg-accent-soft [&_mark]:text-accent"
                  dangerouslySetInnerHTML={{ __html: achado.html }}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
