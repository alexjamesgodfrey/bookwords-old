import debugFunc from "debug"
import { decodeHTML } from "entities"
import EPub, { TocElement } from "epub"

// // match all html tags, no matter their contents
const htmlRegex = /(<([^>]+)>)/gi
const floatingChars = [".", "?", "!", ":", ";", ","]

const cleanText = (text: string) => {
  // a sentence that ends with a tag followed by a period was leaving an extra space
  let result = decodeHTML(text)

  result = result.replace(/<\/p[^>]*>/g, "~++~")

  result = result
    .replace(htmlRegex, " ") // these are replaced by spaces so that newlines in the text are properly tokenized
    .replace(/“ /g, "“")
    .replace(/ ”/g, "”")
    .replace(/"/g, "") // non-smart quotes complicate spaces and counting words, but don't really matter
    .replace(/\s+/g, " ")
    .trim()

  floatingChars.forEach((c) => {
    result = result.replace(new RegExp(` \\${c}`, "g"), c)
  })

  return result
}

const getTextForChapter = async (book: EPub, id: string): Promise<string> => {
  return new Promise((resolve) => {
    // using getChapter instead of getChapterRaw. the former of which pulls out style automatically
    try {
      book.getChapter(id, (err: Error, text: string) => {
        if (err) {
          debugFunc(
            `failed to parse chapter id: ${id} because of error: ${err}`
          )
          // eat the error
          resolve("")
          return
        }

        resolve(cleanText(text))
      })
    } catch (err) {
      debugFunc(
        `hard failed to parse chapter id: ${id} because of error: "${err}" in book ${book.metadata.title}`
      )
      resolve("")
    }
  })
}

/**
 * given a space-separated string, counts the number of words.
 */
export const countWordsInString = (text: string) => {
  return text.split(/\s+/gm).filter((x) => Boolean(x.trim())).length
}

// TODO: be smarter about this
// id also has info?
const ignoredTitlesRegex =
  /acknowledgment|copyright|cover|dedication|title|author|contents/i
export const shouldParseChapter = (chapter: TocElement): boolean => {
  return !Boolean(chapter.title) || !chapter.title.match(ignoredTitlesRegex)
}

/**
 * given a valid parsed book, returns an array of strings. Each array element is the full text of a chapter.
 */
export const getTextFromBook = async (book: EPub): Promise<string[]> => {
  console.log("hi")

  return (
    await Promise.all(
      book.flow.map(async (chapter) => {
        if (!shouldParseChapter(chapter)) {
          return ""
        }
        return getTextForChapter(book, chapter.id)
      })
    )
  ).filter(Boolean)
}

const getWordCountsForChapters = (chapters: string[]): number =>
  chapters.reduce(
    (total, chapterText) => countWordsInString(chapterText) + total,
    0
  )

const getCharacterCountsForChapters = (chapters: string[]): number =>
  chapters.reduce((total, chapterText) => chapterText.length + total, 0)

export const countWordsInBook = async (book: EPub): Promise<number> => {
  const chapterTexts = await getTextFromBook(book)
  return getWordCountsForChapters(chapterTexts)
}

export const countCharactersInBook = async (book: EPub): Promise<number> => {
  const chapterTexts = await getTextFromBook(book)
  return getCharacterCountsForChapters(chapterTexts)
}

// this mostly combines the above
export const getBookDetails = async (book: EPub) => {
  const chapterTexts = await getTextFromBook(book)
  return {
    text: chapterTexts.join("\n"),
    characterCount: getCharacterCountsForChapters(chapterTexts),
    wordCount: getWordCountsForChapters(chapterTexts),
  }
}
