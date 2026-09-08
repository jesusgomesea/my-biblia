export type LivroCanonico = {
  id: number
  nome: string
  capitulos: number
  /** Abreviações e grafias alternativas aceitas na busca por referência. */
  apelidos: string[]
}

/**
 * Os nomes que a fonte externa devolve variam por tradução e trazem caracteres
 * cirílicos trocados em alguns livros ("Аmós", "Мiquéias"), então a interface
 * usa esta tabela em vez deles. A numeração é a do canon protestante e coincide
 * com o `bookid` do Bolls.life.
 */
export const LIVROS: LivroCanonico[] = [
  { id: 1, nome: 'Gênesis', capitulos: 50, apelidos: ['gn', 'gen', 'genesis'] },
  { id: 2, nome: 'Êxodo', capitulos: 40, apelidos: ['ex', 'exo', 'exodo'] },
  { id: 3, nome: 'Levítico', capitulos: 27, apelidos: ['lv', 'lev', 'levitico'] },
  { id: 4, nome: 'Números', capitulos: 36, apelidos: ['nm', 'num', 'numeros'] },
  { id: 5, nome: 'Deuteronômio', capitulos: 34, apelidos: ['dt', 'deu', 'deuteronomio'] },
  { id: 6, nome: 'Josué', capitulos: 24, apelidos: ['js', 'jos', 'josue'] },
  { id: 7, nome: 'Juízes', capitulos: 21, apelidos: ['jz', 'juizes'] },
  { id: 8, nome: 'Rute', capitulos: 4, apelidos: ['rt', 'rute'] },
  { id: 9, nome: '1 Samuel', capitulos: 31, apelidos: ['1sm', '1sam', '1samuel'] },
  { id: 10, nome: '2 Samuel', capitulos: 24, apelidos: ['2sm', '2sam', '2samuel'] },
  { id: 11, nome: '1 Reis', capitulos: 22, apelidos: ['1rs', '1re', '1reis'] },
  { id: 12, nome: '2 Reis', capitulos: 25, apelidos: ['2rs', '2re', '2reis'] },
  { id: 13, nome: '1 Crônicas', capitulos: 29, apelidos: ['1cr', '1cro', '1cronicas'] },
  { id: 14, nome: '2 Crônicas', capitulos: 36, apelidos: ['2cr', '2cro', '2cronicas'] },
  { id: 15, nome: 'Esdras', capitulos: 10, apelidos: ['ed', 'esd', 'esdras'] },
  { id: 16, nome: 'Neemias', capitulos: 13, apelidos: ['ne', 'nee', 'neemias'] },
  { id: 17, nome: 'Ester', capitulos: 10, apelidos: ['et', 'est', 'ester'] },
  { id: 18, nome: 'Jó', capitulos: 42, apelidos: ['jo', 'job'] },
  { id: 19, nome: 'Salmos', capitulos: 150, apelidos: ['sl', 'sal', 'salmo', 'salmos'] },
  { id: 20, nome: 'Provérbios', capitulos: 31, apelidos: ['pv', 'pro', 'proverbios'] },
  { id: 21, nome: 'Eclesiastes', capitulos: 12, apelidos: ['ec', 'ecl', 'eclesiastes'] },
  { id: 22, nome: 'Cantares', capitulos: 8, apelidos: ['ct', 'cant', 'cantares', 'canticos'] },
  { id: 23, nome: 'Isaías', capitulos: 66, apelidos: ['is', 'isa', 'isaias'] },
  { id: 24, nome: 'Jeremias', capitulos: 52, apelidos: ['jr', 'jer', 'jeremias'] },
  { id: 25, nome: 'Lamentações', capitulos: 5, apelidos: ['lm', 'lam', 'lamentacoes'] },
  { id: 26, nome: 'Ezequiel', capitulos: 48, apelidos: ['ez', 'eze', 'ezequiel'] },
  { id: 27, nome: 'Daniel', capitulos: 12, apelidos: ['dn', 'dan', 'daniel'] },
  { id: 28, nome: 'Oseias', capitulos: 14, apelidos: ['os', 'ose', 'oseias'] },
  { id: 29, nome: 'Joel', capitulos: 3, apelidos: ['jl', 'joel'] },
  { id: 30, nome: 'Amós', capitulos: 9, apelidos: ['am', 'amo', 'amos'] },
  { id: 31, nome: 'Obadias', capitulos: 1, apelidos: ['ob', 'obd', 'obadias'] },
  { id: 32, nome: 'Jonas', capitulos: 4, apelidos: ['jn', 'jon', 'jonas'] },
  { id: 33, nome: 'Miqueias', capitulos: 7, apelidos: ['mq', 'miq', 'miqueias'] },
  { id: 34, nome: 'Naum', capitulos: 3, apelidos: ['na', 'nau', 'naum'] },
  { id: 35, nome: 'Habacuque', capitulos: 3, apelidos: ['hc', 'hab', 'habacuque'] },
  { id: 36, nome: 'Sofonias', capitulos: 3, apelidos: ['sf', 'sof', 'sofonias'] },
  { id: 37, nome: 'Ageu', capitulos: 2, apelidos: ['ag', 'age', 'ageu'] },
  { id: 38, nome: 'Zacarias', capitulos: 14, apelidos: ['zc', 'zac', 'zacarias'] },
  { id: 39, nome: 'Malaquias', capitulos: 4, apelidos: ['ml', 'mal', 'malaquias'] },
  { id: 40, nome: 'Mateus', capitulos: 28, apelidos: ['mt', 'mat', 'mateus'] },
  { id: 41, nome: 'Marcos', capitulos: 16, apelidos: ['mc', 'mar', 'marcos'] },
  { id: 42, nome: 'Lucas', capitulos: 24, apelidos: ['lc', 'luc', 'lucas'] },
  { id: 43, nome: 'João', capitulos: 21, apelidos: ['joao', 'jao'] },
  { id: 44, nome: 'Atos', capitulos: 28, apelidos: ['at', 'ato', 'atos'] },
  { id: 45, nome: 'Romanos', capitulos: 16, apelidos: ['rm', 'rom', 'romanos'] },
  { id: 46, nome: '1 Coríntios', capitulos: 16, apelidos: ['1co', '1cor', '1corintios'] },
  { id: 47, nome: '2 Coríntios', capitulos: 13, apelidos: ['2co', '2cor', '2corintios'] },
  { id: 48, nome: 'Gálatas', capitulos: 6, apelidos: ['gl', 'gal', 'galatas'] },
  { id: 49, nome: 'Efésios', capitulos: 6, apelidos: ['ef', 'efe', 'efesios'] },
  { id: 50, nome: 'Filipenses', capitulos: 4, apelidos: ['fp', 'fil', 'filipenses'] },
  { id: 51, nome: 'Colossenses', capitulos: 4, apelidos: ['cl', 'col', 'colossenses'] },
  { id: 52, nome: '1 Tessalonicenses', capitulos: 5, apelidos: ['1ts', '1tes', '1tessalonicenses'] },
  { id: 53, nome: '2 Tessalonicenses', capitulos: 3, apelidos: ['2ts', '2tes', '2tessalonicenses'] },
  { id: 54, nome: '1 Timóteo', capitulos: 6, apelidos: ['1tm', '1tim', '1timoteo'] },
  { id: 55, nome: '2 Timóteo', capitulos: 4, apelidos: ['2tm', '2tim', '2timoteo'] },
  { id: 56, nome: 'Tito', capitulos: 3, apelidos: ['tt', 'tit', 'tito'] },
  { id: 57, nome: 'Filemom', capitulos: 1, apelidos: ['fm', 'flm', 'filemom'] },
  { id: 58, nome: 'Hebreus', capitulos: 13, apelidos: ['hb', 'heb', 'hebreus'] },
  { id: 59, nome: 'Tiago', capitulos: 5, apelidos: ['tg', 'tia', 'tiago'] },
  { id: 60, nome: '1 Pedro', capitulos: 5, apelidos: ['1pe', '1pd', '1pedro'] },
  { id: 61, nome: '2 Pedro', capitulos: 3, apelidos: ['2pe', '2pd', '2pedro'] },
  { id: 62, nome: '1 João', capitulos: 5, apelidos: ['1jo', '1joao'] },
  { id: 63, nome: '2 João', capitulos: 1, apelidos: ['2jo', '2joao'] },
  { id: 64, nome: '3 João', capitulos: 1, apelidos: ['3jo', '3joao'] },
  { id: 65, nome: 'Judas', capitulos: 1, apelidos: ['jd', 'jud', 'judas'] },
  { id: 66, nome: 'Apocalipse', capitulos: 22, apelidos: ['ap', 'apo', 'apocalipse'] },
]

export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

const POR_CHAVE = new Map<string, LivroCanonico>()
for (const livro of LIVROS) {
  POR_CHAVE.set(normalizar(livro.nome), livro)
  for (const apelido of livro.apelidos) POR_CHAVE.set(normalizar(apelido), livro)
}

export function livroPorId(id: number): LivroCanonico | undefined {
  return LIVROS[id - 1]
}

/** Resolve "Pv", "proverbios", "1 Coríntios", "1co" para o livro canônico. */
export function acharLivro(termo: string): LivroCanonico | undefined {
  return POR_CHAVE.get(normalizar(termo))
}
