import Link from 'next/link'
import { bible, livroPorId, TRADUCAO_PADRAO } from '@/lib/bible'
import type { Leitura } from '@/lib/planos/tipos'

/**
 * Bloco do "versiculo do dia" na home. Server component: puxa o capitulo
 * inteiro do provedor (cache de 7 dias) e recorta a fatia curada. Falha
 * silenciosamente com null se a rede estiver indisponivel, para nao derrubar
 * a home.
 */
export default async function VersiculoEmDestaque({
  leitura,
}: {
  leitura: Leitura
}) {
  const versiculos = await bible
    .getChapter(TRADUCAO_PADRAO, leitura.livro, leitura.capitulo)
    .catch(() => null)

  if (!versiculos) return null

  const fatia = versiculos.filter(
    (v) =>
      v.number >= leitura.versiculoInicio && v.number <= leitura.versiculoFim,
  )
  if (fatia.length === 0) return null

  const nomeLivro = livroPorId(leitura.livro)?.nome ?? `Livro ${leitura.livro}`
  const referencia =
    leitura.versiculoInicio === leitura.versiculoFim
      ? `${nomeLivro} ${leitura.capitulo}:${leitura.versiculoInicio}`
      : `${nomeLivro} ${leitura.capitulo}:${leitura.versiculoInicio}-${leitura.versiculoFim}`

  return (
    <aside className="rounded-2xl border border-borda bg-surface p-6 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-muted">
        Versículo do dia
      </p>

      <blockquote className="leitura-texto mt-4 space-y-2 font-serif">
        {fatia.map((versiculo) => (
          <p key={versiculo.number} className="flex gap-2">
            <span className="w-6 shrink-0 pt-1.5 text-right font-sans text-xs text-muted">
              {versiculo.number}
            </span>
            {/* Sanitizado em lib/bible/sanitize.ts. */}
            <span dangerouslySetInnerHTML={{ __html: versiculo.html }} />
          </p>
        ))}
      </blockquote>

      <p className="mt-4 text-sm text-muted">
        {referencia} · {TRADUCAO_PADRAO}
      </p>

      <Link
        href={`/biblia/${TRADUCAO_PADRAO}/${leitura.livro}/${leitura.capitulo}#v${leitura.versiculoInicio}`}
        className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
      >
        Ler no contexto →
      </Link>
    </aside>
  )
}
