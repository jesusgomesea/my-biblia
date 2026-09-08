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

- **Next.js (App Router) + TypeScript** — frontend e rotas de API no mesmo
  projeto.
- Rotas de API do Next atuam como **proxy** para as fontes externas, o que
  mantém chaves fora do navegador e permite cache.
- Estilo, banco de dados e autenticação: **ainda não definidos**.

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
| 2026-09-08 | Stack: Next.js + TypeScript. |
| 2026-09-08 | Repositório público no GitHub. |
| 2026-09-08 | Apenas fontes bíblicas livres / domínio público. |
| 2026-09-08 | Geração dos planos de estudo via IA. |

## Em aberto

- Qual provedor de IA usar para gerar os planos.
- Se haverá contas de usuário (e qual banco), ou se marcações e planos ficam
  apenas no navegador.
- Biblioteca de estilo (Tailwind ou outra).
- Estratégia de cache do texto bíblico.
- Idiomas da interface (a interface começa em pt-BR).

## Estado atual

Projeto recém-iniciado. Ainda **sem código de aplicação** — apenas este
documento de escopo e o versionamento.
