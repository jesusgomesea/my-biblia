import { GoogleGenAI, Type } from '@google/genai'
import { acharLivro, livroPorId } from '@/lib/bible'
import type { DiaDoPlano, Leitura, PedidoDePlano } from './tipos'

/**
 * A disponibilidade dos modelos do Gemini oscila: em poucos minutos o mesmo
 * modelo alterna entre 200 e 503 por pico de demanda, e modelos antigos sao
 * aposentados com 404. Por isso tentamos vários em ordem em vez de fixar um.
 */
const MODELOS = [
  process.env.MODELO_GEMINI,
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-flash-lite-latest',
].filter((m): m is string => Boolean(m))

const INSTRUCAO = `Você monta planos de estudo bíblico para pessoas comuns.

Regras:
- Indique APENAS referências (livro, capítulo, versículo inicial e final) do
  canon protestante de 66 livros. NUNCA escreva o texto bíblico: o aplicativo
  busca o texto na tradução que a pessoa escolheu.
- Use nomes de livros em português do Brasil, por extenso.
- Calibre o volume ao tempo diário informado, contando cerca de 200 palavras
  por minuto de leitura pausada, e deixando espaço para a reflexão.
- O foco de cada dia deve avançar sobre o anterior, formando um percurso, não
  uma lista solta de passagens.
- A reflexão é uma pergunta ou provocação curta, em português do Brasil.`

const ESQUEMA = {
  type: Type.OBJECT,
  properties: {
    titulo: { type: Type.STRING },
    resumo: { type: Type.STRING },
    dias: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dia: { type: Type.INTEGER },
          foco: { type: Type.STRING },
          reflexao: { type: Type.STRING },
          leituras: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                livro: { type: Type.STRING },
                capitulo: { type: Type.INTEGER },
                versiculoInicio: { type: Type.INTEGER },
                versiculoFim: { type: Type.INTEGER },
              },
              required: ['livro', 'capitulo', 'versiculoInicio', 'versiculoFim'],
            },
          },
        },
        required: ['dia', 'foco', 'reflexao', 'leituras'],
      },
    },
  },
  required: ['titulo', 'resumo', 'dias'],
}

type LeituraCrua = {
  livro: string
  capitulo: number
  versiculoInicio: number
  versiculoFim: number
}

type DiaCru = {
  dia: number
  foco: string
  reflexao: string
  leituras: LeituraCrua[]
}

type PlanoCru = { titulo: string; resumo: string; dias: DiaCru[] }

/** A IA devolve nomes de livros em texto livre; aqui viram ids validados. */
function converterLeitura(crua: LeituraCrua): Leitura | null {
  const livro = acharLivro(crua.livro ?? '')
  if (!livro) return null

  const capitulo = Math.trunc(crua.capitulo)
  if (capitulo < 1 || capitulo > livro.capitulos) return null

  const inicio = Math.max(1, Math.trunc(crua.versiculoInicio) || 1)
  const fim = Math.max(inicio, Math.trunc(crua.versiculoFim) || inicio)

  return { livro: livro.id, capitulo, versiculoInicio: inicio, versiculoFim: fim }
}

function converterRoteiro(cru: PlanoCru, diasPedidos: number): DiaDoPlano[] {
  return cru.dias
    .slice(0, diasPedidos)
    .map((dia, indice) => ({
      dia: indice + 1,
      foco: dia.foco,
      reflexao: dia.reflexao,
      leituras: (dia.leituras ?? [])
        .map(converterLeitura)
        .filter((l): l is Leitura => l !== null),
    }))
    .filter((dia) => dia.leituras.length > 0)
}

/** 503 e 429 são pico de demanda; 404 é modelo aposentado. Ambos: próximo. */
function valeTentarOutroModelo(erro: unknown): boolean {
  const status = (erro as { status?: number })?.status
  return status === 503 || status === 429 || status === 404
}

export async function gerarPlano(pedido: PedidoDePlano) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY não configurada')

  const ai = new GoogleGenAI({ apiKey })
  const prompt = [
    `Temas: ${pedido.temas.join(', ')}.`,
    `Duração: ${pedido.dias} dias.`,
    `Tempo por dia: ${pedido.minutosPorDia} minutos.`,
  ].join(' ')

  let ultimoErro: unknown
  for (const model of MODELOS) {
    try {
      const resposta = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: INSTRUCAO,
          responseMimeType: 'application/json',
          responseSchema: ESQUEMA,
          temperature: 0.7,
        },
      })

      const cru = JSON.parse(resposta.text ?? '') as PlanoCru
      const roteiro = converterRoteiro(cru, pedido.dias)
      if (roteiro.length === 0) throw new Error('Nenhuma passagem válida no plano')

      return { titulo: cru.titulo, resumo: cru.resumo, roteiro }
    } catch (erro) {
      ultimoErro = erro
      if (!valeTentarOutroModelo(erro)) throw erro
    }
  }

  throw ultimoErro
}

export function descreverLeitura(leitura: Leitura): string {
  const livro = livroPorId(leitura.livro)?.nome ?? `Livro ${leitura.livro}`
  const versiculos =
    leitura.versiculoInicio === leitura.versiculoFim
      ? `${leitura.versiculoInicio}`
      : `${leitura.versiculoInicio}-${leitura.versiculoFim}`
  return `${livro} ${leitura.capitulo}:${versiculos}`
}
