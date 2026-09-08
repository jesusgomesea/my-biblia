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
```

## Fontes de dados bíblicos

**Decisão: usar apenas traduções livres / em domínio público.** Isso evita
problemas de licenciamento com traduções protegidas por direitos autorais.

- Candidatas: `bible-api.com`, `Bolls.life`.
- O acesso deve ficar atrás de uma **camada de provider** própria (`lib/bible`),
  de modo que trocar ou somar fontes no futuro não exija reescrever o app.
- Traduções protegidas por direito autoral **não** devem ser adicionadas sem
  antes resolver o licenciamento.

## Decisões tomadas

| Data | Decisão |
|------|---------|
| 2026-09-08 | Stack: Next.js 16 (App Router) + TypeScript. |
| 2026-09-08 | Tailwind CSS v4 como biblioteca de estilo. |
| 2026-09-08 | Repositório público no GitHub. |
| 2026-09-08 | Apenas fontes bíblicas livres / domínio público. |
| 2026-09-08 | Geração dos planos de estudo via IA. |

## Em aberto

- Qual provedor de IA usar para gerar os planos.
- **Onde salvar planos e marcações**: apenas no navegador (sem cadastro) ou em
  contas de usuário com banco de dados (sincroniza entre dispositivos).
- Estratégia de cache do texto bíblico.
- Idiomas da interface (a interface começa em pt-BR).

## Estado atual

Projeto Next.js recém-criado, ainda com a página inicial padrão do template.
Nenhuma funcionalidade do escopo foi implementada.
