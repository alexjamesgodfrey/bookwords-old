import { GoogleBookItem } from 'types/GoogleBooks'

export default function isSameBook(
  book1: GoogleBookItem,
  book2: GoogleBookItem
) {
  return (
    book1.volumeInfo.title === book2.volumeInfo.title &&
    book1.volumeInfo.authors.join() === book2.volumeInfo.authors.join()
  )
}
