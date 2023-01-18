import Container from 'components/Container'
import { Layout } from 'components/Layout'
import Head from 'next/head'
import { GoogleBookItem } from 'types/GoogleBooks'

interface Props {
  book: GoogleBookItem
}

export default function Book({ book }: Props) {
  return (
    <>
      <Head>
        <title>{`${book.volumeInfo.title} Word Count and Word Analysis`}</title>
        <meta
          name="description"
          content={`Bookwords word count and analysis of ${
            book.volumeInfo.title
          } by ${book.volumeInfo.authors.join(', ')}`}
        />
      </Head>
      <Layout book={book}>
        <Container className="prose mx-auto px-4 pb-4 pt-10 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:py-10 lg:px-6 xl:px-12">
          <h2 className="m-0 p-0 text-center">Word Analysis</h2>
        </Container>
      </Layout>
    </>
  )
}

// make static props in future for page speed
export async function getServerSideProps(context: {
  query: {
    book: string
  }
}): Promise<{ props: Props }> {
  // make request to google books api here
  const q = `https://www.googleapis.com/books/v1/volumes/${context.query.book}?key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
  const book = await fetch(q).then((res) => res.json())

  return {
    props: {
      book,
    },
  }
}
