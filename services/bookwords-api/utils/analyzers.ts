import { Word, WordType } from "../types/Words"
import {
  isNotCapitalizedInTitle,
  isProperNoun,
  removeCommonWords,
  removePunctuation,
  removePunctuationExceptApostrophes,
  standardizeFormat,
} from "./processors"

const isWord = require("is-word")

export function wordCount(text: string[]) {
  return text.length
}

export function charactersWithSpaces(text: string[]) {
  return text.join("").length
}

export function charactersWithoutSpaces(text: string[]) {
  return text.join("").replace(/ /g, "").length
}

export function specificCount(word: string, text: string[]) {
  return text.reduce((prev, curr) => (curr === word ? prev + 1 : prev), 0)
}

export function isEnglishWord(tester: any, word: string) {
  const lword = word.toLocaleLowerCase()

  if (word.length === 1) return lword === "i" || lword === "a"

  return tester.check(lword)
}

export function wordsToOccurencesSimple(text: string[]) {
  const wordMap = new Map()

  text.forEach((word) => {
    const naked = removePunctuation(word.toLocaleLowerCase())

    if (naked === "") return // ignore empty strings

    if (wordMap.has(naked)) {
      wordMap.set(naked, wordMap.get(naked) + 1)
    } else {
      wordMap.set(naked, 1)
    }
  })

  return wordMap
}

export function wordsToOccurencesComplex(labeledWords: Word[]) {
  const wordMap = new Map()

  labeledWords.forEach((word) => {
    const wordString = JSON.stringify(word)

    if (wordMap.has(wordString)) {
      wordMap.set(wordString, wordMap.get(wordString) + 1)
    } else {
      wordMap.set(wordString, 1)
    }
  })

  return wordMap
}

function labelText(text: string[]): Word[] {
  const tester = isWord("american-english")
  const mega = text.join(" ")
  const words = mega.split(" ")
  const labeledWords: Word[] = []

  let previous = ""
  let ignoreCount = 0

  words.forEach((word, index, array) => {
    if (ignoreCount > 0) {
      ignoreCount--
      return
    }

    let realWord = standardizeFormat(word)
    let type

    if (isProperNoun(previous, realWord)) {
      while (
        array[index + 1] &&
        (isProperNoun(realWord, array[index + 1]) ||
          isNotCapitalizedInTitle(realWord, array[index + 1]))
      ) {
        if (realWord.split(" ").length === 1 && array[index + 1] === "and")
          break

        realWord += " " + array[index + 1]
        previous = array[index + 1]
        ignoreCount++
        index++

        // stop if there is a comma or and in the middle of our proper phrase
        if (
          (realWord.endsWith(",") || realWord.endsWith("~++~")) &&
          isProperNoun(previous, array[index + 1])
        ) {
          break
        }
      }

      // check if proper phrase ends with something that shouldnt be in it
      realWord = removePunctuationExceptApostrophes(realWord)
      const properArr = realWord.split(" ")
      const lastWord = properArr.pop() || ""

      if (isNotCapitalizedInTitle("", lastWord)) {
        realWord = realWord.replace(new RegExp(lastWord + "$"), "") // replaces last occurrence
        ignoreCount--
      }

      realWord = realWord.trim()

      type =
        properArr.length > 1 ? WordType.PROPER_PHRASE : WordType.PROPER_NOUN
    } else if (
      tester.check(removePunctuationExceptApostrophes(word.toLocaleLowerCase()))
    ) {
      type = WordType.WORD
      realWord = removePunctuationExceptApostrophes(
        realWord.toLocaleLowerCase()
      )
      previous = word
    } else {
      type = WordType.INVENTED
      realWord = removePunctuationExceptApostrophes(realWord)
      previous = word
    }

    if (realWord.length > 0) {
      labeledWords.push({
        word: realWord,
        type,
      })
    }
  })

  return labeledWords
}

export function masterAnalysis(text: string[]) {
  const asString = text.join(" ")

  const unlabeledWords = asString
    .split(" ")
    .map((w) => removePunctuationExceptApostrophes(w.trim()))

  const labeledWords = labelText(text)

  const wordCount = labeledWords.reduce((prev, curr) => {
    if (curr.type === WordType.PROPER_PHRASE) {
      return prev + curr.word.split(" ").length
    }
    return prev + 1
  }, 0)

  const charactersIncludingSpaces = asString.length

  const charactersExcludingSpaces = unlabeledWords.join("").length

  const sentences = asString.split(/[.?!]/g).filter((s) => s.length > 0)

  const paragraphs = asString.split(/[~++~]/g).filter((p) => p.length > 0)

  const uniqueWordCount = new Set(unlabeledWords).size

  const wordsLessThanFive = unlabeledWords.filter((w) => w.length < 5)

  const averageWordLength = charactersExcludingSpaces / wordCount

  const averageSentenceLength = wordCount / sentences.length

  const averageParagraphLength = wordCount / paragraphs.length

  const longestString = unlabeledWords.reduce(
    (prev, curr) => (curr.length > prev.length ? curr : prev),
    ""
  )

  // const occurrences = wordsToOccurencesComplex(labeledWords)
  const occurences = wordsToOccurencesSimple(unlabeledWords)

  const ret = {
    totalWords: wordCount,
    charactersIncludingSpaces: charactersIncludingSpaces,
    charactersExcludingSpaces: charactersExcludingSpaces,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    uniqueWords: uniqueWordCount,
    wordsLessThanFive: wordsLessThanFive.length,
    averageWordLength: averageWordLength,
    averageSentenceLength: averageSentenceLength,
    averageParagraphLength: averageParagraphLength,
    longestWord: longestString,
    top100WordsCommon: Array.from(occurences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100),
    top100WordsWithoutCommon: removeCommonWords(Array.from(occurences))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100),
    // top100WordsCommon: Array.from(occurrences)
    //   .sort((a, b) => b[1] - a[1])
    //   .slice(0, 100),
    // top100WordsWithoutCommon: removeCommonWords(Array.from(occurrences))
    //   .sort((a, b) => b[1] - a[1])
    //   .slice(0, 100),
  }

  console.log(ret)

  return ret
}
