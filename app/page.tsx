import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-wider text-accent">
            Bíblia + planos de estudo
          </p>
          <h1 className="mt-3 font-serif text-4xl/tight font-semibold lg:text-6xl/tight">
            Leia a Bíblia no seu ritmo — e estude com um plano feito para você.
          </h1>
          <p className="mt-6 max-w-xl text-muted lg:text-lg">
            Dezenas de traduções, em vários idiomas. Diga sobre o que quer
            refletir, quantos dias tem e quantos minutos cabem no seu dia: o
            plano de estudo sai pronto.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/planos/novo"
              className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-background"
            >
              Montar um plano de estudo
            </Link>
            <Link
              href="/biblia"
              className="rounded-md border border-borda px-5 py-3 text-sm font-medium"
            >
              Abrir a Bíblia
            </Link>
          </div>
        </div>

        <aside className="hidden lg:block">
          <div className="rounded-2xl border border-borda bg-surface p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-muted">
              Exemplo de plano
            </p>
            <p className="mt-3 font-serif text-lg font-medium">
              Caminho do Perdão em 7 dias
            </p>
            <p className="mt-1 text-sm text-muted">15 min por dia · em NVT</p>
            <ol className="mt-5 space-y-3 text-sm">
              <ItemPlano dia={1} foco="A dívida impagável" passagem="Mateus 18:21-35" />
              <ItemPlano dia={2} foco="Ser perdoado" passagem="Salmos 32" />
              <ItemPlano dia={3} foco="Perdoar quem?" passagem="Lucas 6:27-36" />
              <ItemPlano dia={4} foco="Sem guardar mágoa" passagem="Efésios 4:26-32" />
            </ol>
            <p className="mt-4 text-xs text-muted">
              Um exemplo do que a IA monta em segundos.
            </p>
          </div>
        </aside>
      </section>

      <section className="mt-20 grid gap-6 sm:grid-cols-3">
        <Recurso
          titulo="Sem cadastro"
          descricao="Nada de conta ou senha. Seus planos e marcações ficam no próprio navegador."
        />
        <Recurso
          titulo="Várias traduções"
          descricao="Escolha entre dezenas de traduções em português e outros idiomas."
        />
        <Recurso
          titulo="Do seu jeito"
          descricao="Tempo diário, prazo e temas definidos por você. A IA calibra o plano ao seu ritmo."
        />
      </section>
    </div>
  );
}

function ItemPlano({
  dia,
  foco,
  passagem,
}: {
  dia: number;
  foco: string;
  passagem: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs text-accent">
        {dia}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{foco}</span>
        <span className="block text-xs text-muted">{passagem}</span>
      </span>
    </li>
  );
}

function Recurso({
  titulo,
  descricao,
}: {
  titulo: string;
  descricao: string;
}) {
  return (
    <div className="rounded-lg border border-borda bg-surface p-5">
      <h3 className="font-serif text-lg font-medium">{titulo}</h3>
      <p className="mt-2 text-sm text-muted">{descricao}</p>
    </div>
  );
}
