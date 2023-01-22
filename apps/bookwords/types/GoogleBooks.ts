export interface NativeBook {
  googleId: string
  title: string
  authors: string[]
  publishedDate: string
  description: string
  pageCount: number
  imageLink: string
}

export interface GoogleVolumeInfo {
  title: string
  subtitle: string
  authors: string[]
  publisher: string
  publishedDate: string
  description: string
  industryIdentifiers: {
    type: string
    identifier: string
  }[]
  pageCount: number
  printType: string
  categories: string[]
  averageRating: number
  ratingsCount: number
  imageLinks: {
    smallThumbnail: string
    thumbnail: string
    small?: string
    medium?: string
    large?: string
  }
  language: string
  previewLink: string
  infoLink: string
  canonicalVolumeLink: string
}

export interface GoogleBookItem {
  kind: string
  id: string
  etag: string
  selfLink: string
  volumeInfo: GoogleVolumeInfo
}

export interface GoogleBookResponse {
  kind: string
  totalItems: number
  items: GoogleBookItem[]
}
