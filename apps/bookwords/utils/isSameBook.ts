import { GoogleBookItem } from 'types/GoogleBooks'
import SearchItem from 'types/SearchItem'

export default function isSameBook(
  book1: GoogleBookItem,
  book2: GoogleBookItem
) {
  return (
    book1.volumeInfo.title === book2.volumeInfo.title &&
    book1.volumeInfo.authors.join() === book2.volumeInfo.authors.join()
  )
}

export function isSameSearchResult(result1: SearchItem, result2: SearchItem) {
  return (
    result1.id === result2.id ||
    (result1.title === result2.title &&
      result1.authors.join() === result2.authors.join())
  )
}
