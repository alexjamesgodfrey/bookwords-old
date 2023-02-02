import Head from 'next/head'
// import { CallToAction } from 'components/Home/CallToAction'
// import { Faqs } from 'components/Home/Faqs'
import { Header } from 'components/Home/Header'
import { Hero } from 'components/Home/Hero'
// import { Pricing } from 'components/Home/Pricing'
// import { PrimaryFeatures } from 'components/Home/PrimaryFeatures'
// import { SecondaryFeatures } from 'components/Home/SecondaryFeatures'
// import { Testimonials } from 'components/Home/Testimonials'

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
      <Header />
      <main>
        <Hero />
        {/* <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs /> */}
      </main>
      {/* <Footer /> */}
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 99999,
  }
}
