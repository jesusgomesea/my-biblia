import FormularioPlano from '@/components/formulario-plano'
import { bible, TRADUCAO_PADRAO } from '@/lib/bible'

export default async function NovoPlano() {
  const linguas = await bible.listLanguages()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold">Montar um plano</h1>
      <p className="mt-2 text-muted">
        Diga o que quer estudar e quanto tempo tem. O roteiro sai dia a dia.
      </p>
      <div className="mt-8">
        <FormularioPlano linguas={linguas} traducaoPadrao={TRADUCAO_PADRAO} />
      </div>
    </div>
  )
}
