import Head from 'next/head'

import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import Login from 'components/Login'

export default function Home() {
  const session = useSession()
  const supabase = useSupabaseClient()

  return (
    <>
      <Head>
        <title>Bookwords</title>
        <meta
          name="description"
          content="A free and publicly accessible word count API."
        />
      </Head>
      <Login />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 99999,
  }
}
