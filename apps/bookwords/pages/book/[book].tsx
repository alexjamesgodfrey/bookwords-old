import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Contribution from 'components/Analysis/Contribution'
import Container from 'components/Container'
import { Layout } from 'components/Layout'
import AuthPopup from 'components/Login/AuthPopup'
import Upload from 'components/Upload'
import Head from 'next/head'
import { useState } from 'react'
import { GoogleBookItem } from 'types/GoogleBooks'
import { Database } from 'types/supabase'
import supabase from 'utils/supabase'

interface Props {
  book: GoogleBookItem
  contributions: Database['public']['Tables']['contributions']['Row'][]
}

export default function Book({ book, contributions }: Props) {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()

  const [showLogin, setShowLogin] = useState(false)

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
      <Layout book={book} setShowLogin={setShowLogin}>
        <Container className="prose mx-auto max-w-none px-4 pb-4 pt-6 sm:px-6 md:px-4 lg:min-h-full lg:py-6 lg:px-6 xl:px-12">
          <AuthPopup show={showLogin} setShow={setShowLogin} />
          <main className="flex w-full flex-col items-center gap-4">
            <div className="relative flex w-full items-baseline justify-between">
              <h2 className="m-0 p-0">
                Word Analysis{' '}
                <span className="text-sm">
                  contribution from{' '}
                  <span className="cursor-pointer">Alex Godfrey</span>
                </span>
              </h2>
              <p className="m-0 cursor-pointer p-0 text-right text-sm text-gray-500">
                see all contributions
              </p>
            </div>

            {contributions.length > 0 ? (
              <Contribution contribution={contributions[0]} book={book} />
            ) : (
              <Upload setShowLogin={setShowLogin} book={book} />
            )}
          </main>
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

  // request to supabase to see if book contributions exist
  const { data: contributions, error } = await supabase
    .from('contributions')
    .select('*')
    .eq('google_id', context.query.book)

  console.log('hi')

  console.log(contributions)

  return {
    props: {
      book,
      contributions,
    },
  }
}
