'use client'

import { useEffect, useState } from 'react'
import {
  calcularStreak,
  listarAtividade,
  observarAtividade,
} from '@/lib/atividade'

const DIAS_DA_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const NOMES_DOS_MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

/**
 * Streak em numero grande, ao lado de um mini-calendario do mes corrente
 * com pontos nos dias com atividade. Foco em cadencia — nao pretende
 * substituir uma tela de estatisticas.
 */
export default function PainelStreak() {
  const [datas, setDatas] = useState<string[]>([])
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    const atualizar = () => {
      setDatas(listarAtividade())
      setPronto(true)
    }
    atualizar()
    return observarAtividade(atualizar)
  }, [])

  if (!pronto) return null

  const hoje = new Date()
  const streak = calcularStreak(datas, hoje)
  const set = new Set(datas)
  const grade = gradeDoMes(hoje)

  return (
    <div className="rounded-lg border border-borda bg-surface p-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">
            Sequência
          </p>
          <p className="mt-1 font-serif text-3xl font-semibold">
            {streak === 0 ? (
              <span className="text-muted">—</span>
            ) : (
              <>
                {streak}{' '}
                <span className="text-sm font-normal text-muted">
                  {streak === 1 ? 'dia' : 'dias'}
                </span>
              </>
            )}
          </p>
        </div>
        <p className="font-serif text-sm text-muted">
          {NOMES_DOS_MESES[hoje.getMonth()]}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px]">
        {DIAS_DA_SEMANA.map((d, i) => (
          <span key={i} className="text-muted">
            {d}
          </span>
        ))}
        {grade.map((celula, i) => (
          <Celula
            key={i}
            dia={celula.dia}
            eHoje={celula.eHoje}
            eDoMes={celula.eDoMes}
            comAtividade={celula.chave ? set.has(celula.chave) : false}
          />
        ))}
      </div>

      {streak === 0 && datas.length === 0 && (
        <p className="mt-4 text-xs text-muted">
          Marque um versículo ou conclua o dia de um plano para começar sua
          sequência.
        </p>
      )}
    </div>
  )
}

function Celula({
  dia,
  eHoje,
  eDoMes,
  comAtividade,
}: {
  dia: number
  eHoje: boolean
  eDoMes: boolean
  comAtividade: boolean
}) {
  if (!eDoMes) return <span aria-hidden />
  return (
    <span
      aria-label={comAtividade ? `Dia ${dia}, com atividade` : `Dia ${dia}`}
      className={`relative mx-auto flex size-6 items-center justify-center rounded-full text-[10px] tabular-nums ${
        eHoje ? 'ring-1 ring-accent' : ''
      } ${comAtividade ? 'bg-accent text-background' : 'text-muted'}`}
    >
      {dia}
    </span>
  )
}

/** Devolve 6 semanas × 7 dias, com metadados para renderizacao. */
function gradeDoMes(agora: Date): {
  dia: number
  eHoje: boolean
  eDoMes: boolean
  chave: string | null
}[] {
  const ano = agora.getFullYear()
  const mes = agora.getMonth()
  const primeiroDoMes = new Date(ano, mes, 1)
  const primeiroDiaSemana = primeiroDoMes.getDay()
  const ultimoDia = new Date(ano, mes + 1, 0).getDate()
  const hojeDia = agora.getDate()

  const celulas: {
    dia: number
    eHoje: boolean
    eDoMes: boolean
    chave: string | null
  }[] = []
  for (let i = 0; i < primeiroDiaSemana; i++) {
    celulas.push({ dia: 0, eHoje: false, eDoMes: false, chave: null })
  }
  for (let d = 1; d <= ultimoDia; d++) {
    const chave = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    celulas.push({ dia: d, eHoje: d === hojeDia, eDoMes: true, chave })
  }
  return celulas
}
