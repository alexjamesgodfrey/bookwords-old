import { GoogleBookItem, NativeBook } from 'types/GoogleBooks'
import imageFromBook from 'utils/imageFromBook'

export default function getNativeBook(book: GoogleBookItem): NativeBook {
  return {
    googleId: book.id,
    title: book.volumeInfo.title,
    authors: book.volumeInfo.authors,
    publishedDate: book.volumeInfo.publishedDate,
    description: book.volumeInfo.description,
    pageCount: book.volumeInfo.pageCount,
    imageLink: imageFromBook(book),
  }
}
