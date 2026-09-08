# my-biblia

> Documento vivo. Atualize este arquivo sempre que uma decisão de escopo,
> arquitetura ou stack mudar.

## Visão geral

Site público e gratuito para leitura da Bíblia e para a criação de **planos de
estudo personalizados**. Qualquer pessoa pode usar, sem barreira de entrada.

A ideia central: o usuário diz **sobre o que quer aprender ou refletir**, em
**quantos dias** e **quantos minutos por dia** tem disponível — e o site monta o
plano de estudo para ele.

## Objetivos

1. Dar acesso simples e rápido ao texto bíblico, em várias traduções e idiomas.
2. Transformar uma intenção vaga ("quero refletir sobre sabedoria") em um
   roteiro de leitura concreto, dia a dia, dimensionado ao tempo real da pessoa.
3. Manter a experiência leve: sem cadastro obrigatório para ler, sem poluição.

## Escopo funcional

### 1. Planos de estudo (funcionalidade principal)

- Tela de **criação de plano**, onde o usuário informa:
  - **Temas** — lista livre de assuntos. Ex.: `["sabedoria", "responsabilidade"]`
  - **Duração** — quantidade de dias.
  - **Tempo diário** — minutos disponíveis por dia.
- Um modelo de **IA** gera o plano a partir desses parâmetros: para cada dia,
  as passagens a ler, um foco de reflexão e uma estimativa de tempo.
- Tela de **meus planos**: lista dos planos criados, com progresso.
- Tela de **execução do plano**: o dia atual, com as passagens já carregadas
  para leitura e marcação de conclusão.

### 2. Navegação da Bíblia

- Navegação hierárquica: **livro > capítulo > versículo**.
- Troca de tradução / idioma.
- Leitura de capítulo inteiro com versículos endereçáveis.

### 3. Busca

- Busca por referência (ex.: `João 3:16`, `Pv 3`).
- Busca por texto dentro da tradução selecionada.

### 4. Marcação de versículos

- Destacar / favoritar versículos.
- Anotações pessoais em um versículo (a definir na modelagem).

## Stack

- **Next.js 16** (App Router) + **React** + **TypeScript**
- **Tailwind CSS v4** para estilo
- **ESLint** (`eslint-config-next`)
- Node.js 22

As rotas de API do Next atuam como **proxy** para as fontes externas, o que
mantém chaves fora do navegador e permite cache.

> **Atenção ao trabalhar com Next.js aqui:** este projeto usa o Next.js 16, que
> tem mudanças de API e de convenções em relação a versões anteriores. Antes de
> escrever código de app, consulte os guias em `node_modules/next/dist/docs/`.
> O arquivo `AGENTS.md` na raiz é gerado e mantido pelo próprio `next dev` —
> não o edite à mão.

### Comandos

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Sobe o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build de produção |
| `npm run lint` | Roda o ESLint |

### Estrutura pretendida

```
app/
  page.tsx              # home
  biblia/               # navegação livro > capítulo > versículo
  planos/               # criar, listar e executar planos
  api/
    biblia/             # proxy das fontes bíblicas
    planos/gerar/       # geração do plano via IA
components/             # componentes de UI reutilizáveis
lib/
  bible/                # camada de provider das fontes bíblicas
  storage/              # persistência no localStorage (planos e marcações)
```

## Fontes de dados bíblicos

**Provedor atual: [Bolls.life](https://bolls.life)** — não exige chave de API e
oferece **152 traduções em 31 idiomas**, sendo 16 em português. É o que mais se
aproxima do objetivo de "qualquer tradução, qualquer língua".

Endpoints em uso:

| Endpoint | Retorna |
|----------|---------|
| `/static/bolls/app/views/languages.json` | Catálogo de idiomas e traduções |
| `/get-books/{translation}/` | Os 66 livros, com nome e nº de capítulos |
| `/get-text/{translation}/{book}/{chapter}/` | Versículos do capítulo |
| `/v2/find/{translation}?search=...` | Busca textual, com `<mark>` no trecho |

Os livros são identificados por número (`bookid` de 1 a 66), não por nome.

> **Risco de licenciamento em aberto.** O Bolls.life serve tanto traduções em
> domínio público (ex.: `TB10`, Almeidas antigas) quanto traduções ainda
> protegidas por direito autoral (ex.: `NVIPT`, `NVT`, `NAA`, `MENS`). Servir o
> catálogo inteiro **não** é o mesmo que servir só material livre. Decidir se o
> app expõe o catálogo completo ou apenas uma lista curada de traduções livres
> continua pendente — ver *Em aberto*.

O acesso fica atrás de uma **camada de provider** própria (`lib/bible`), de modo
que trocar ou somar fontes no futuro não exija reescrever o app.

## Decisões tomadas

| Data | Decisão |
|------|---------|
| 2026-09-08 | Stack: Next.js 16 (App Router) + TypeScript. |
| 2026-09-08 | Tailwind CSS v4 como biblioteca de estilo. |
| 2026-09-08 | Repositório público no GitHub. |
| 2026-09-08 | Fonte bíblica sem chave de API e sem cadastro (descartada a API.Bible). |
| 2026-09-08 | Geração dos planos de estudo via IA. |
| 2026-09-08 | Sem cadastro: planos e marcações ficam no `localStorage` do navegador. |
| 2026-09-08 | Bolls.life como provedor bíblico inicial (sem chave, 152 traduções). |

## Em aberto

- Qual provedor de IA usar para gerar os planos.
- **Curadoria do catálogo de traduções**: expor as 152 do Bolls.life ou apenas
  as que estão em domínio público (ver o risco de licenciamento acima).
- Estratégia de cache do texto bíblico.
- Idiomas da interface (a interface começa em pt-BR).
- Se um dia houver contas de usuário, como migrar o que está no `localStorage`.

## Estado atual

Projeto Next.js recém-criado, ainda com a página inicial padrão do template.
Nenhuma funcionalidade do escopo foi implementada.
