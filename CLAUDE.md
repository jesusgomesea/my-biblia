# my-biblia

> Documento vivo. Atualize este arquivo sempre que uma decisão de escopo,
> arquitetura ou stack mudar.
>
> Trabalho em andamento e "o que fazer ao chegar em outra máquina" mora em
> [PROXIMOS-PASSOS.md](./PROXIMOS-PASSOS.md).

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
| `npm test` | Roda os testes unitários (Vitest) |
| `npm run test:watch` | Vitest em modo watch |
| `npm run test:e2e` | Roda os testes end-to-end (Playwright) |
| `npm run test:e2e:install` | Instala os navegadores do Playwright |
| `npm run linguas:atualizar` | Rebaixa o catálogo de línguas do Bolls.life |

### Estrutura

```
app/
  page.tsx                             # home
  biblia/[traducao]/[livro]/[capitulo] # leitura, renderizada no servidor
  busca/                               # referência ou texto
  marcacoes/                           # versículos marcados
  planos/                              # criar, listar e executar planos
  api/
    biblia/passagem/                   # trecho avulso, para as telas de plano
    planos/gerar/                      # geração do plano via IA
components/                            # componentes de UI reutilizáveis
lib/
  bible/                               # provider, tabela canônica, sanitização
  planos/                              # tipos, geração por IA, localStorage
  marcacoes.ts                         # versículos marcados no localStorage
```

As telas de leitura e busca são Server Components que chamam `lib/bible`
direto. Só existe rota de API onde o navegador precisa buscar algo sozinho:
a geração do plano e o trecho avulso das telas de plano (o plano mora no
`localStorage`, então não dá para renderizá-lo no servidor).

## Fontes de dados bíblicos

**Provedor atual: [Bolls.life](https://bolls.life)** — não exige chave de API e
oferece **152 traduções em 31 idiomas**, sendo 16 em português.

Endpoints em uso:

| Endpoint | Retorna |
|----------|---------|
| `/static/bolls/app/views/languages.json` | Catálogo de idiomas e traduções |
| `/get-books/{translation}/` | Livros disponíveis naquela tradução |
| `/get-text/{translation}/{book}/{chapter}/` | Versículos do capítulo |
| `/v2/find/{translation}?search=...` | Busca textual, com `<mark>` no trecho |

Particularidades da fonte, já tratadas no código e que não devem ser
"simplificadas" de volta:

- **Livros são numerados de 1 a 66**, não nomeados. Os nomes que ela devolve
  variam por tradução ("O Evangelho de João" vs "João") e alguns trazem
  caracteres cirílicos no lugar de latinos ("Аmós", "Мiquéias"). Por isso a
  interface usa a tabela canônica de `lib/bible/livros.ts`.
- **O texto vem com HTML**: `<S>` de números de Strong, `<sup>` de notas,
  `<i>` de itálico e `<mark>` na busca. Ele é renderizado como HTML, então
  passa por `lib/bible/sanitize.ts`, que escapa tudo e reintroduz só `<i>` e
  `<mark>`.
- **A busca é difusa** e mistura versículos que não contêm o termo. O `total`
  que ela devolve é o pool difuso (milhares, constante) e não corresponde ao
  que o leitor veria. Só valem os trechos que ela marca com `<mark>`.
- Nem toda tradução tem os 66 livros (há traduções só de Novo Testamento).

> **Risco de licenciamento em aberto.** O Bolls.life serve tanto traduções em
> domínio público quanto traduções ainda protegidas por direito autoral (ex.:
> `NVIPT`, `NVT`, `NAA`, `MENS`). Servir o catálogo inteiro **não** é o mesmo
> que servir só material livre. Ver *Em aberto*.

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
| 2026-09-09 | Auth **opcional**: deslogado usa localStorage; logado sincroniza com o servidor. |
| 2026-09-09 | ~~Auth.js v5 + Credentials, contas em Blobs com bcrypt~~ — substituído no mesmo dia por Netlify Identity. |
| 2026-09-09 | **Netlify Identity** (`@netlify/identity`) como provedor de contas: traz confirmação de email e recuperação de senha nativas, e os usuários passam a ser administráveis pelo painel. Dados seguem no store `usuarios`, chaveado pelo id do Identity. |
| 2026-09-08 | Bolls.life como provedor bíblico inicial (sem chave, 152 traduções). |
| 2026-09-08 | Gemini como provedor de IA, via `@google/genai`. |
| 2026-09-08 | A IA indica só referências; o texto vem sempre da tradução escolhida. |
| 2026-09-08 | Marcações guardadas por referência, sem tradução, para valerem em todas. |
| 2026-09-08 | Playwright como ferramenta de verificação dos fluxos no navegador. |
| 2026-09-09 | PWA instalável (manifest + ícones, sem service worker). |
| 2026-09-09 | Layout desktop de `/planos` em duas colunas com barra lateral de módulos. |
| 2026-09-09 | Vitest para testes unitários; Playwright versionado em `tests/e2e`. |
| 2026-09-09 | Catálogo de línguas servido de JSON versionado, com script de refresh. |
| 2026-09-09 | Router Cache do Next com `staleTimes: { static: 600 }` para navegação instantânea entre capítulos já vistos. |

## Geração dos planos (IA)

`lib/planos/gerar.ts` chama o Gemini pedindo **apenas referências**, nunca o
texto bíblico: assim o plano vale em qualquer tradução e não há risco de
citação inventada. Os nomes de livros que a IA devolve são resolvidos contra a
tabela canônica e as passagens fora do canon são descartadas.

A disponibilidade dos modelos oscila muito: o mesmo modelo alterna entre 200 e
503 em minutos, e modelos antigos somem com 404. Por isso a geração percorre uma
**cadeia de modelos** em vez de fixar um. Quando os primeiros estão
congestionados a resposta pode levar ~30s, o que a interface precisa acomodar.

Variáveis de ambiente:

| Variável | Para quê |
|----------|----------|
| `GEMINI_API_KEY` | Obrigatória. Fica no `.env.local` e, em produção, no painel do host. |
| `MODELO_GEMINI` | Opcional. Entra no início da cadeia de modelos. |

## Em aberto

- **Curadoria do catálogo de traduções**: expor as 152 do Bolls.life ou apenas
  as que estão em domínio público (ver o risco de licenciamento acima).
- **Abuso da rota de geração**: ela é pública e gasta cota paga da chave do
  Gemini. Não há limite por origem nem por IP.
- Idiomas da interface (a interface começa em pt-BR).
- Sincronização: hoje o servidor vira fonte da verdade no primeiro login,
  sem merge fino. Se o usuário editar em dois navegadores off-line, o último
  a sincronizar sobrescreve o outro.
- Ampliar cobertura de testes: hoje o Vitest cobre sanitização, referência
  e conversão da leitura da IA; o Playwright cobre navegação, PWA e leitura
  de planos semeados no `localStorage`. Falta cobrir busca por texto (rede)
  e o fluxo real de criação de plano (requer mock do Gemini).

## Autenticação e persistência

Login com **email + senha** via **Netlify Identity**, usando o pacote
`@netlify/identity` — a biblioteca *headless* (não é o antigo
`netlify-identity-widget`, nem o `gotrue-js` de baixo nível, ambos
desaconselhados para projeto novo).

**O Identity precisa estar ligado no painel** (Site configuration → Identity).
Não há segredo nosso nem variável de ambiente: o endpoint
(`/.netlify/identity`) vem do runtime do Netlify. Por isso, localmente, é
`netlify dev` e não `next dev` — vale tanto para o login quanto para os Blobs.

Divisão adotada, que é a recomendada para frameworks com SSR:

- **Mutações no navegador**: `login()`, `signup()`, `logout()`,
  `updateUser()`. Elas falam direto com o Identity e escrevem o cookie
  `nf_jwt`.
- **Leitura no servidor**: `getUser()` em `app/api/dados/route.ts`, que valida
  o cookie da requisição.

Depois de qualquer mutação de auth a navegação é feita com
`window.location.href`, **nunca** `router.push()`: a navegação suave do Next
não carrega o cookie recém-escrito, e o servidor continuaria vendo a sessão
antiga. Existe uma regra do ESLint que reclama disso; os pontos onde ela é
silenciada trazem o motivo no comentário.

`components/provedor-sessao.tsx` faz o papel do antigo `SessionProvider`:
junta `getUser()` e `onAuthChange()` num contexto e expõe `useSessao()`. A
sessão é resolvida **no cliente** de propósito — chamar `getUser()` num Server
Component tornaria a página dinâmica, e as telas de leitura são
prerenderizadas por decisão de performance.

Esse mesmo provedor trata os links que o Identity manda por email
(confirmação, recuperação, troca de email). Eles voltam com o token no hash da
URL e podem cair em qualquer página, então o `handleAuthCallback()` mora no
layout raiz, e não numa rota `/callback`. Recuperação de senha cai em
`/nova-senha`; o pedido do link fica em `/recuperar-senha`.

Confirmação de email e recuperação de senha são do próprio Identity: não
precisamos de serviço de email. Se `autoconfirm` estiver desligado (o padrão),
o cadastro **não** abre sessão — o usuário recebe um link e só entra depois de
clicar.

Enquanto o usuário está deslogado tudo continua no `localStorage` (o app
funciona 100% sem entrar). Assim que ele entra, o `components/sincronizador.tsx`
decide entre baixar o snapshot da nuvem ou subir o que já existe no
navegador — a partir daí toda escrita local também aciona
`sincronizarDepois()` que faz PUT em `/api/dados`.

Dados do usuário ficam no Netlify Blobs, store `usuarios`, um JSON por conta:
`{ planos, marcacoes }`, chaveado pelo id do Identity. Ver
`lib/dados/servidor.ts`.

## Publicação

| Onde | O quê |
|------|-------|
| Repositório | https://github.com/jesusgomesea/my-biblia (público) |
| Produção | https://my-biblia.netlify.app |

O Netlify detecta o Next.js sozinho e aplica o adaptador OpenNext. Não fixe a
versão do adaptador nem acrescente build command ou publish directory ao
`netlify.toml` — a própria documentação desaconselha. Também não use
`output: 'export'`: as telas de leitura e as rotas de API precisam de servidor.

Existe um `netlify.toml` **por um motivo único**: limitar a taxa de
`/api/planos/gerar`, que é pública e gasta cota paga do Gemini. A documentação
do Netlify não confirma que o limite nativo vale para rotas do Next servidas
pelo adaptador, mas foi verificado em produção: com o limite em 10 por minuto,
as requisições passam a receber 429 por volta da 17ª (o bloqueio leva alguns
segundos para entrar) e a janela se recupera sozinha. O plano gratuito permite
duas regras dessas por projeto.

A `GEMINI_API_KEY` é cadastrada nas variáveis de ambiente do painel do Netlify,
já que o `.env.local` não é versionado.

## Estado atual

Todo o escopo funcional inicial está implementado e verificado **em produção**:
leitura com troca de tradução, busca por referência e por texto, marcação de
versículos e o ciclo completo dos planos (criar, listar, executar).
