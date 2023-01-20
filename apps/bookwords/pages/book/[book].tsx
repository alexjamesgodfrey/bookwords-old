import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Container from 'components/Container'
import { Layout } from 'components/Layout'
import AuthPopup from 'components/Login/AuthPopup'
import uploadEpub from 'hooks/files/uploadEpub'
import Head from 'next/head'
import { useState } from 'react'
import { GoogleBookItem } from 'types/GoogleBooks'
import { Database } from 'types/supabase'
import { Button } from 'ui'

interface Props {
  book: GoogleBookItem
}

export default function Book({ book }: Props) {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()

  const [showLogin, setShowLogin] = useState(false)
  const [uploading, setUploading] = useState(false)

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
          {user ? (
            <>
              <input
                style={{
                  visibility: 'hidden',
                  position: 'absolute',
                }}
                type="file"
                id="epub"
                accept=".epub"
                onChange={(e) => uploadEpub(supabase, user, setUploading, e)}
                disabled={uploading}
              />
              <label htmlFor="epub" className="cursor-pointer">
                <Button
                  variant="primary"
                  arrow="up"
                  className="pointer-events-none"
                >
                  Upload epub
                </Button>
              </label>
            </>
          ) : (
            <Button
              variant="primary"
              arrow="up"
              className=""
              onClick={() => setShowLogin(true)}
            >
              Upload epub
            </Button>
          )}
          <AuthPopup show={showLogin} setShow={setShowLogin} />
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
