# my-biblia

Site aberto para ler a Bíblia e montar planos de estudo no seu ritmo.

Você diz **sobre o que quer refletir**, em **quantos dias** e **quantos minutos
por dia** tem disponível — e o roteiro sai pronto, dia a dia.

## O que dá para fazer

- **Ler** em 152 traduções, de 31 idiomas, navegando por livro e capítulo.
- **Buscar** por referência (`João 3:16`, `Pv 3`) ou por palavra no texto.
- **Marcar versículos** com um toque no número. A marca vale em qualquer
  tradução, porque é guardada pela referência, não pelo texto.
- **Montar planos de estudo** a partir de temas, duração e tempo diário, e
  acompanhar o progresso.

Não há cadastro. Planos e marcações ficam no `localStorage` do seu navegador —
o que significa que são só seus, mas também que não acompanham você para outro
aparelho.

## Como o plano é montado

A IA recebe os temas, os dias e os minutos, e devolve **apenas as referências**
de cada dia, mais um foco e uma pergunta para reflexão. O texto bíblico nunca
vem dela: é buscado na tradução que você escolheu. Assim o plano não corre o
risco de citar um versículo que não existe, e continua válido se você trocar de
tradução no meio do caminho.

## Rodando localmente

Requer Node.js 20 ou superior.

```bash
npm install
cp .env.example .env.local   # e preencha a chave
npm run dev
```

O site sobe em http://localhost:3000.

### Variáveis de ambiente

| Variável | Obrigatória | Para quê |
|----------|-------------|----------|
| `GEMINI_API_KEY` | sim | Gera os planos de estudo. Crie a sua em [Google AI Studio](https://aistudio.google.com/apikey). |
| `MODELO_GEMINI` | não | Força um modelo específico. Sem ela, o app percorre uma lista de modelos até um responder. |

Sem a chave o site continua funcionando para leitura, busca e marcações — só a
criação de planos falha.

### Outros comandos

```bash
npm run build   # build de produção
npm start       # sobe o build
npm run lint    # ESLint
```

## Stack

Next.js 16 (App Router), React, TypeScript e Tailwind CSS v4. As telas de
leitura e busca são renderizadas no servidor; as de plano e marcação rodam no
navegador, já que os dados moram lá.

O texto bíblico vem do [Bolls.life](https://bolls.life), atrás de uma camada de
provider em `lib/bible` — trocar de fonte é trocar uma linha.

## Publicando

Funciona em qualquer host que rode Next.js com servidor (Netlify e Vercel
suportam sem configuração extra). Não use `output: 'export'`: as telas de
leitura e as rotas de API precisam de servidor.

Lembre de cadastrar a `GEMINI_API_KEY` nas variáveis de ambiente do host.

## Sobre as traduções

O catálogo do Bolls.life mistura traduções em domínio público com traduções
ainda protegidas por direito autoral. Este projeto expõe o catálogo como ele
vem. Se você for publicar sua própria instância, vale conferir quais traduções
pode servir na sua jurisdição.
