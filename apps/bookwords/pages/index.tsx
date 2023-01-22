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

  console.log(user)

  return (
    <>
      <Head>
        <title>Bookwords</title>
        <meta
          name="description"
          content="A free and publicly accessible word count API."
        />
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
