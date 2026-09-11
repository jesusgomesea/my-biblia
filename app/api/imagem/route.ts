import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { bible, livroPorId, stripHtml, TRADUCAO_PADRAO } from '@/lib/bible'

/**
 * Gera um PNG 1080x1080 com o versiculo em destaque, para compartilhar em
 * Instagram Stories e afins. As paletas ficam em variantes fechadas — deixar
 * cor livre por URL abriria porta para ataque de conteudo/estilo. Fonte:
 * Georgia como fallback confiavel no runtime da Vercel/Netlify (Edge).
 */

type Paleta = {
  fundo: string
  texto: string
  muted: string
}

const PALETAS: Record<string, Paleta> = {
  bege: { fundo: '#f0e7d8', texto: '#3d2f1a', muted: '#7a5c34' },
  noite: { fundo: '#14130f', texto: '#ece7dd', muted: '#d3ab72' },
  claro: { fundo: '#fbfaf7', texto: '#1c1a17', muted: '#6b655c' },
  sepia: { fundo: '#efe5cc', texto: '#4a3a2a', muted: '#8a6c4a' },
}

function inteiro(cru: string | null, padrao: number): number {
  const n = Number(cru)
  return Number.isFinite(n) && Number.isInteger(n) ? n : padrao
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const livro = inteiro(searchParams.get('livro'), 0)
  const capitulo = inteiro(searchParams.get('capitulo'), 0)
  const vi = inteiro(searchParams.get('vi'), 0)
  const vf = inteiro(searchParams.get('vf'), vi)
  const traducaoBruta = searchParams.get('t') ?? TRADUCAO_PADRAO
  const traducao = /^[A-Za-z0-9_-]{1,20}$/.test(traducaoBruta)
    ? traducaoBruta
    : TRADUCAO_PADRAO
  const fundoChave = searchParams.get('fundo') ?? 'bege'
  const paleta = PALETAS[fundoChave] ?? PALETAS.bege

  const livroCanonico = livroPorId(livro)
  if (!livroCanonico || capitulo < 1 || vi < 1) {
    return new Response('Referência inválida', { status: 400 })
  }

  const versiculos = await bible
    .getChapter(traducao, livro, capitulo)
    .catch(() => null)
  if (!versiculos) {
    return new Response('Passagem indisponível', { status: 502 })
  }

  const fim = Math.max(vi, vf)
  const fatia = versiculos.filter((v) => v.number >= vi && v.number <= fim)
  if (fatia.length === 0) {
    return new Response('Versículo fora do capítulo', { status: 400 })
  }

  const texto = fatia.map((v) => stripHtml(v.html)).join(' ')
  const referencia =
    vi === fim
      ? `${livroCanonico.nome} ${capitulo}:${vi}`
      : `${livroCanonico.nome} ${capitulo}:${vi}-${fim}`

  // Ajusta o tamanho do texto ao volume: aspas curtas ganham mais respiro.
  const fonteTexto = texto.length < 120 ? 60 : texto.length < 300 ? 48 : 38

  return new ImageResponse(
    (
      <div
        style={{
          width: 1080,
          height: 1080,
          background: paleta.fundo,
          color: paleta.texto,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '100px 90px',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: paleta.muted,
          }}
        >
          my<span style={{ color: paleta.texto, margin: '0 6px' }}>·</span>biblia
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: fonteTexto,
            lineHeight: 1.4,
            fontStyle: 'italic',
          }}
        >
          “{texto}”
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 40, fontWeight: 600 }}>{referencia}</span>
          <span style={{ fontSize: 26, color: paleta.muted }}>{traducao}</span>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 },
  )
}
