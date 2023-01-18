import { Combobox } from '@headlessui/react'
import SearchResult from 'components/Search/SearchResult'
import LoadingSpinner from 'icons/LoadingSpinner'
import NoResultsIcon from 'icons/NoResultsIcon'
import { GoogleBookItem } from 'types/GoogleBooks'

interface Props {
  query: string
  loading: boolean
  results: GoogleBookItem[]
}

export default function SearchResults({ query, loading, results }: Props) {
  if (!query) {
    return (
      <div className="p-6 text-center dark:bg-zinc-900">
        <NoResultsIcon className="mx-auto h-5 w-5 stroke-zinc-900 dark:stroke-zinc-600" />
        <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-400">
          Enter a full title or author name to search
        </p>
      </div>
    )
  }

  if (!results || results.length === 0) {
    return (
      <div className="p-6 text-center dark:bg-zinc-900">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <NoResultsIcon className="mx-auto h-5 w-5 stroke-zinc-900 dark:stroke-zinc-600" />
        )}
        {!loading && (
          <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-400">
            Nothing found for{' '}
            <strong className="break-words font-semibold text-zinc-900 dark:text-white">
              &lsquo;{query}&rsquo;
            </strong>
            . Please try again.
          </p>
        )}
      </div>
    )
  }

  return (
    <Combobox.Options>
      {results.map((result, resultIndex) => (
        <SearchResult
          key={result.id}
          result={result}
          resultIndex={resultIndex}
        />
      ))}
    </Combobox.Options>
  )
}
