import { SupabaseClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"
import { NativeBook } from "../types/NativeBook"
import { Database } from "../types/supabase"

export default async function uploadBookDetails(
  supabase: SupabaseClient<Database>,
  native_book: NativeBook
) {
  const bookId = uuidv4()

  const { data: book, error: bookError } = await supabase.from("books").insert([
    {
      id: bookId,
      google_id: native_book.googleId,
      title: native_book.title,
      published_date: native_book.publishedDate,
      description: native_book.description,
      pages: native_book.pageCount,
      image: native_book.imageLink,
    },
  ])

  const authorIds: string[] = []

  for (const author of native_book.authors) {
    // fetch the author by name and create if it doesn't exist
    let { data: authors } = await supabase
      .from("authors")
      .select("*")
      // Filters
      .eq("name", author)

    if (authors?.length === 0) {
      const authorId = uuidv4()

      const { data, error: authorError } = await supabase
        .from("authors")
        .insert([{ id: authorId, name: author }])

      authorIds.push(authorId)
    } else if (authors !== null) {
      authorIds.push(authors[0].id)
    }
  }

  // create the book_author relationships
  for (const authorId of authorIds) {
    const { data, error: authorError } = await supabase
      .from("authors_on_book")
      .insert([{ book_id: bookId, author_id: authorId }])
  }

  return bookId
}
