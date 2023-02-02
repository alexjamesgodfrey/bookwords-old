import Head from 'next/head'

import {
  useSession,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'

export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()

  const user = useUser()

  return (
    <>
      <Head>
        <title>Bookwords</title>
        <meta
          name="description"
          content="A free and publicly accessible word count API."
        />
        <link rel="icon" href="/favicon.ico"/>
      </Head>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 99999,
  }
}
