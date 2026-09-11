import Link from "next/link";
import ContinuarLeitura from "@/components/continuar-leitura";
import VersiculoEmDestaque from "@/components/versiculo-em-destaque";
import { versiculoDoDia } from "@/lib/versiculo-do-dia";

export default function Home() {
  const leitura = versiculoDoDia();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <ContinuarLeitura />

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

        <div className="hidden lg:block">
          <VersiculoEmDestaque leitura={leitura} />
        </div>
      </section>

      {/* No mobile o versiculo vira uma sessao propria, abaixo do hero. */}
      <section className="mt-12 lg:hidden">
        <VersiculoEmDestaque leitura={leitura} />
      </section>

      <section className="mt-20 grid gap-6 sm:grid-cols-3">
        <Recurso
          titulo="Sem cadastro"
          descricao="Nada de conta ou senha obrigatórios. Seus planos e marcações ficam no próprio navegador."
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
