import { Combobox, Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import SearchInput from 'components/Search/SearchInput'
import SearchResults from 'components/Search/SearchResults'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { GoogleBookItem } from 'types/GoogleBooks'
import SearchItem from 'types/SearchItem'
import { Database } from 'types/supabase'
import imageFromBook from 'utils/imageFromBook'
import makeQueryString from 'utils/makeQueryString'
import supabase from 'utils/supabase'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  className?: string
}

export default function SearchDialog({ open, setOpen, className }: Props) {
  let router = useRouter()

  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchItem[]>([])
  const [selectedResult, setSelectedResult] = useState(searchResults[0] || null)

  useEffect(() => {
    if (!open) {
      return
    }

    function onRouteChange() {
      setOpen(false)
    }

    router.events.on('routeChangeStart', onRouteChange)
    router.events.on('hashChangeStart', onRouteChange)

    return () => {
      router.events.off('routeChangeStart', onRouteChange)
      router.events.off('hashChangeStart', onRouteChange)
    }
  }, [open, setOpen, router])

  useEffect(() => {
    if (open) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, setOpen])

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query === '') {
        setSearchResults([])
        return
      }

      setLoading(true)
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5&key=${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY}`
      )
      const data = await response.json()
      const queryWords = makeQueryString(query.trim())
      const nativeData = await supabase
        .from('books')
        .select()
        .textSearch('description', queryWords)
      setLoading(false)

      // filter out duplicates (same title & author)
      const usedTitles: string[] = []
      const nativeResults = nativeData.data ? nativeData.data.map((book: Database['public']['Tables']['books']['Row']) => {
        usedTitles.push(book.title)
        return { id: book.google_id, title: book.title, url: book.image, authors: [], native: true }
      }).reverse() : []
      console.log(nativeResults)
      const filteredItems: SearchItem[] = data.items
        ? data.items.reduce((acc: SearchItem[], item: GoogleBookItem) => {
          if (usedTitles.some((t) => t === item.volumeInfo.title)) {
            return acc
          }
          // console.log(acc)
          const asSearchResult = { id: item.id, title: item.volumeInfo.title, url: imageFromBook(item), authors: [], native: false }
          // console.log(acc.some((b) => b.id, asSearchResult.id))
          return [...acc, asSearchResult]
        }, nativeResults)
        : []

      setSearchResults(filteredItems)
    }

    fetchSearchResults()
  }, [query])

  return (
    <Transition.Root
      show={open}
      as={Fragment}
    // afterLeave={() => autocomplete.setQuery('')}
    >
      <Dialog
        onClose={setOpen}
        className={classNames('fixed inset-0 z-50', className)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto px-4 py-12 sm:py-20 sm:px-6 md:py-32 lg:px-8 lg:py-[15vh]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="ring-zinc-900/7.5 mx-auto overflow-hidden rounded-lg bg-zinc-50 shadow-xl ring-1 dark:bg-zinc-900 dark:ring-zinc-800 sm:max-w-xl">
              <Combobox
                value={selectedResult}
                onChange={(value) => {
                  console.log('change')
                  router.push(`/book/${value.id}`)
                  setSelectedResult(value)
                }}
              // {...autocomplete.getRootProps({})}
              >
                <SearchInput
                  query={query}
                  setQuery={setQuery}
                  onClose={() => setOpen(false)}
                />
                <div
                  className="dark:bg-white/2.5 border-t border-zinc-200 bg-white empty:hidden dark:border-zinc-100/5"
                // {...autocomplete.getPanelProps({})}
                >
                  {/* {autocompleteState.isOpen && ( */}
                  <>
                    <SearchResults
                      query={query}
                      loading={loading}
                      results={searchResults}
                    />
                  </>
                  {/* )} */}
                </div>
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
