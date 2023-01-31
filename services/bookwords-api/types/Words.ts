export enum WordType {
  WORD,
  PROPER_NOUN,
  PROPER_PHRASE,
  INVENTED,
}

export type Word = {
  word: string
  type: WordType
}
