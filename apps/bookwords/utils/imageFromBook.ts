import { GoogleBookItem } from 'types/GoogleBooks'

/**
 * Returns the url of the thumbnail image for the book, starting with medium --
 * or the default if there is no image
 * @param book google book
 * @returns the url of the thumbnail image for the book, starting with medium -- small
 */
export default function imageFromBook(book: GoogleBookItem): string {
  return (
    book.volumeInfo.imageLinks?.medium ||
    book.volumeInfo.imageLinks?.small ||
    book.volumeInfo.imageLinks?.thumbnail ||
    book.volumeInfo.imageLinks.smallThumbnail ||
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png'
  )
}
