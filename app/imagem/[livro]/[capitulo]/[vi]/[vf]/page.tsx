import Link from 'next/link'
import { notFound } from 'next/navigation'
import SeletorPaleta from '@/components/seletor-paleta'
import { livroPorId, TRADUCAO_PADRAO } from '@/lib/bible'

const PALETAS = ['bege', 'noite', 'claro', 'sepia'] as const

export default async function PreviewImagem(
  props: PageProps<'/imagem/[livro]/[capitulo]/[vi]/[vf]'>,
) {
  const { livro, capitulo, vi, vf } = await props.params
  const searchParams = await props.searchParams

  const idLivro = Number(livro)
  const numCapitulo = Number(capitulo)
  const numVi = Number(vi)
  const numVf = Number(vf)
  if (
    ![idLivro, numCapitulo, numVi, numVf].every(Number.isInteger) ||
    idLivro < 1 ||
    numCapitulo < 1
  ) {
    notFound()
  }

  const livroCanonico = livroPorId(idLivro)
  if (!livroCanonico) notFound()

  const traducao =
    typeof searchParams.t === 'string' &&
    /^[A-Za-z0-9_-]{1,20}$/.test(searchParams.t)
      ? searchParams.t
      : TRADUCAO_PADRAO
  const fundoBruto =
    typeof searchParams.fundo === 'string' ? searchParams.fundo : 'bege'
  const fundo = (PALETAS as readonly string[]).includes(fundoBruto)
    ? fundoBruto
    : 'bege'

  const params = new URLSearchParams({
    livro: String(idLivro),
    capitulo: String(numCapitulo),
    vi: String(numVi),
    vf: String(numVf),
    t: traducao,
    fundo,
  })
  const src = `/api/imagem?${params}`

  const referencia =
    numVi === numVf
      ? `${livroCanonico.nome} ${numCapitulo}:${numVi}`
      : `${livroCanonico.nome} ${numCapitulo}:${numVi}-${numVf}`

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-xs uppercase tracking-wider text-accent">
        Gerar imagem
      </p>
      <h1 className="mt-1 font-serif text-2xl font-semibold">{referencia}</h1>
      <p className="mt-2 text-sm text-muted">
        Tradução {traducao}. Pronto para Instagram Stories (1080 × 1080).
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Cartão do versículo ${referencia}`}
        width={1080}
        height={1080}
        className="mt-6 h-auto w-full rounded-lg border border-borda"
      />

      <SeletorPaleta
        atual={fundo}
        paletas={PALETAS}
        base={`/imagem/${idLivro}/${numCapitulo}/${numVi}/${numVf}`}
        traducao={traducao}
      />

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={src}
          download={`${referencia.replace(/[^a-z0-9]/gi, '-')}-${fundo}.png`}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-background"
        >
          Baixar imagem
        </a>
        <Link
          href={`/biblia/${traducao}/${idLivro}/${numCapitulo}#v${numVi}`}
          className="rounded-md border border-borda px-4 py-2 text-sm font-medium"
        >
          Ver no contexto
        </Link>
      </div>
    </div>
  )
}
