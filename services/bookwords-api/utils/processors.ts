/**
 * Standardizes the word: converts ’ apostrophes to ' apostrophes.
 * @param word the word to standardize
 * @returns The word in standaradized format.
 */
export function standardizeFormat(word: string) {
  if (word.toLocaleUpperCase() === word && word.length !== 1) {
    return word.toLocaleLowerCase().replace(/’/g, "'")
  }

  return word.replace(/’/g, "'")
}

/**
 * A word is a proper noun if the previous word is not the end of a sentence and
 * the word is capitalized.
 * @param previous the previous word
 * @param word the current word
 * @returns true if word is proper, false otherwise
 */
export function isProperNoun(previous: string, word: string) {
  if (previous.endsWith("~++~")) return false

  if (word === "I") return false

  // start of book: assuming not here
  if (previous === "") return false

  // case like introduction ONCE UPON A TIME It was said blah blah blah
  if (previous.length > 2 && previous.toLocaleUpperCase() === previous)
    return false

  // case of all caps word like HELP HELP HELP
  if (word.length > 2 && word.toLocaleUpperCase() === word) return false

  // case in something like George R. R. Martin
  if (word.endsWith(".") && word.length === 2 && word !== "I") return true

  // case following something like R.
  if (previous.endsWith(".") && previous.length === 2 && word !== "I")
    word[0] === word[0].toUpperCase()

  if (previous.endsWith(".")) return false

  // middle of sentence standard case
  return word[0] === word[0].toUpperCase()
}

/**
 * Punctuation is any non letter, space, and number character.
 * @param text the text to remove punctuation from
 * @returns the text without punctuation
 */
export function removePunctuation(text: string) {
  return text.replace(/[^\p{L}\s]/gu, "")
}

/**
 * Punctuation is any non letter, space, and number character, excluding apostrophes.
 * @param text the text to remove punctuation from
 * @returns the text without punctuation (disregarding apostrophes)
 */
export function removePunctuationExceptApostrophes(text: string) {
  return text.replace(/(?!')[^\p{L}\s]/gu, "")
}

/**
 * Determines whether a word should be capitalized in a title. Used to determine
 * when to stop/continue a proper phrase.
 * @param previous the previous word
 * @param word the word to test
 * @returns true if the word should not be capitalized in a title (proper noun),
 * false otherwixe
 */
export function isNotCapitalizedInTitle(previous: string, word: string) {
  if (word === "long") return previous === "as"
  if (word === "only") return previous === "if"
  if (word === "top") return previous === "on"

  return [
    "and",
    "as",
    "at",
    "but",
    "by",
    "even",
    "if",
    "for",
    "from",
    "if",
    "in",
    "into",
    "like",
    "near",
    "nor",
    "of",
    "off",
    "on",
    "once",
    "onto",
    "or",
    "over",
    "past",
    "so",
    "than",
    "that",
    "till",
    "to",
    "up",
    "upon",
    "with",
    "when",
    "yet",
  ].includes(word)
}

export default function isCommonWord(word: string) {
  return [
    "the",
    "be",
    "to",
    "of",
    "and",
    "a",
    "in",
    "that",
    "have",
    "I",
    "it",
    "for",
    "not",
    "on",
    "with",
    "he",
    "as",
    "you",
    "do",
    "at",
    "this",
    "but",
    "his",
    "by",
    "from",
    "they",
    "we",
    "say",
    "her",
    "she",
    "or",
    "an",
    "will",
    "my",
    "one",
    "all",
    "would",
    "there",
    "their",
    "what",
    "so",
    "up",
    "out",
    "if",
    "about",
    "who",
    "get",
    "which",
    "go",
    "me",
    "when",
    "make",
    "can",
    "like",
    "time",
    "no",
    "just",
    "him",
    "know",
    "take",
    "people",
    "into",
    "year",
    "your",
    "good",
    "some",
    "could",
    "them",
    "see",
    "other",
    "than",
    "then",
    "now",
    "look",
    "only",
    "come",
    "its",
    "over",
    "think",
    "also",
    "back",
    "after",
    "use",
    "two",
    "how",
    "our",
    "work",
    "first",
    "well",
    "way",
    "even",
    "new",
    "want",
    "because",
    "any",
    "these",
    "give",
    "day",
    "most",
    "us",
    "was",
    "had",
    "i",
    "were",
    "said",
    "are",
    "been",
    "is",
  ].includes(word)
}

export function removeCommonWords(
  occurrences: [string, number][],
  complex?: boolean
) {
  if (complex) {
    return occurrences.filter(
      (occurrence) => !isCommonWord(JSON.parse(occurrence[0]).word)
    )
  } else {
    return occurrences.filter((occurrence) => !isCommonWord(occurrence[0]))
  }
}
