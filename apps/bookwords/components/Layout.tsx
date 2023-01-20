import AboutSection from 'components/Analysis/AboutSection'
import Header from 'components/Header'
import posterImage from 'images/poster.png'
import Image from 'next/image'
import { GoogleBookItem } from 'types/GoogleBooks'
import Redirects from './Analysis/Redirects'

interface Props {
  book: GoogleBookItem
  children: React.ReactNode
}

export function Layout({ book, children }: Props) {
  return (
    <>
      <header className="bg-slate-50 dark:bg-slate-800 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-112 lg:items-start lg:overflow-y-auto xl:w-120">
        <div className="hidden lg:sticky lg:top-0 lg:flex lg:w-16 lg:flex-none lg:items-center lg:whitespace-nowrap lg:py-12 lg:text-sm lg:leading-7 lg:[writing-mode:vertical-rl]">
          <span className="font-mono text-slate-500 dark:text-zinc-300">
            Analysis provided by{' '}
          </span>
          <span className="mt-4 flex gap-6 font-bold text-orange-600 dark:text-orange-500">
            Sira
          </span>
        </div>
        <div className="relative z-10 mx-auto px-4 pb-4 pt-10 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-x lg:border-slate-200 lg:py-10 lg:px-6 lg:dark:border-slate-300 xl:px-12">
          <div className="relative mx-auto block w-48 overflow-hidden rounded-lg sm:w-64 sm:rounded-xl lg:w-auto lg:rounded-2xl">
            <Image
              className="mx-auto rounded-sm bg-slate-200 shadow-xl shadow-slate-400 dark:shadow-slate-600"
              src={book.volumeInfo.imageLinks?.medium || posterImage}
              alt=""
              sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
              width={150}
              height={150}
              priority
            />
          </div>
          <div className="mt-8 text-center lg:mt-10 lg:text-left">
            <p className="text-xl font-bold text-slate-900 dark:text-zinc-200">
              {book.volumeInfo.title}
            </p>
            <p className="mt-3 text-lg font-medium leading-8 text-slate-700 dark:text-zinc-400">
              {book.volumeInfo.authors?.join(', ')}
            </p>
          </div>
          <AboutSection
            description={book.volumeInfo.description}
            className="mt-12 hidden lg:block"
          />
          <Redirects />
        </div>
      </header>
      <main className="min-h-full border-t  border-slate-200 lg:relative lg:mb-28 lg:ml-112 lg:border-t-0 xl:ml-120">
        <Header />
        {/* <Waveform className="absolute top-0 left-0 right-0 z-[-10] h-20 w-full" /> */}
        <div className="relative">{children}</div>
      </main>
      <footer className="border-t border-slate-200 bg-slate-50 py-10 pb-40 sm:py-16 sm:pb-32 lg:hidden">
        <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4">
          <AboutSection description={book.volumeInfo.description} />
          <div className="mt-2 flex gap-3 text-sm font-bold leading-7 text-slate-900">
            <span className="font-mono text-slate-500">
              Analysis provided by{' '}
            </span>
            <span className="flex gap-6 font-bold text-orange-600">Aris</span>
          </div>
        </div>
      </footer>
    </>
  )
}
