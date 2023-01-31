import EPub from "epub2"
import { Express, Request, Response } from "express"
import { v4 as uuidv4 } from "uuid"
import { NativeBook } from "../types/NativeBook"
import { masterAnalysis } from "../utils/analyzers"
import supabase from "../utils/supabase"
import { getTextFromBook } from "../utils/textHandlers"
import uploadBookDetails from "../utils/uploadBookDetails"
const fs = require("fs")
const path = require("path")

interface AnalysisJson {
  user_id: string
  file_id: string
  native_book: NativeBook
}

module.exports = function (app: Express) {
  app.get("/analysis", (req: Request, res: Response) => {
    res.send("analysis")
  })

  app.post("/analysis/request", async (req: Request, res: Response) => {
    const { user_id, file_id, native_book }: AnalysisJson = req.body

    console.log(native_book)

    let { data: books } = await supabase
      .from("books")
      .select("*")
      // Filters
      .eq("google_id", native_book.googleId)

    console.log(books)

    // create the book if there isn't one
    const bookId =
      (books && books[0] && books[0].id) ||
      (await uploadBookDetails(supabase, native_book))

    // download the file
    const { data, error } = await supabase.storage
      .from("books")
      .download(file_id)

    // save the file locally and analyze it
    if (data) {
      const abuf = await data.arrayBuffer()
      const buf = Buffer.from(abuf)
      const filePath = "epubs/" + uuidv4() + ".epub"
      fs.writeFile(
        filePath,
        buf,
        {
          encoding: "utf8",
        },
        async (err: any) => {
          if (err) console.log(err)

          await EPub.createAsync(filePath)
            .then(async (epub) => {
              const text = await getTextFromBook(epub)
              const result = masterAnalysis(text)

              const contributionId = uuidv4()

              // upload the analysis
              const { data, error } = await supabase
                .from("contributions")
                .insert([
                  {
                    id: contributionId,
                    by: user_id,
                    google_id: native_book.googleId,
                    book_id: bookId,
                    words: result.totalWords,
                    characters_including_spaces:
                      result.charactersIncludingSpaces,
                    characters_excluding_spaces:
                      result.charactersExcludingSpaces,
                    sentences: result.sentences,
                    paragraphs: result.paragraphs,
                    unique_words: result.uniqueWords,
                    short_words: result.wordsLessThanFive,
                    average_word: result.averageWordLength,
                    average_sentence: result.averageSentenceLength,
                    average_paragraph: result.averageParagraphLength,
                    longest_word: result.longestWord,
                  },
                ])

              // upload top 100 words common
              const { data: top100WordsCommon, error: error2 } = await supabase
                .from("tops_on_contribution")
                .insert(
                  result.top100WordsCommon.map((top, index) => ({
                    contribution_id: contributionId,
                    is_common: true,
                    word: top[0],
                    rank: index + 1,
                    count: top[1],
                  }))
                )

              // upload top 100 words uncommon
              const { data: top100WordsUncommon, error: error3 } =
                await supabase.from("tops_on_contribution").insert(
                  result.top100WordsWithoutCommon.map((top, index) => ({
                    contribution_id: contributionId,
                    is_common: false,
                    word: top[0],
                    rank: index + 1,
                    count: top[1],
                  }))
                )
            })
            .catch((err) => {
              console.log("ERROR\n-----")
              console.log(err)
              throw err
            })
        }
      )
    }

    res.send("analysis request")
  })
}
