import { Combobox } from '@headlessui/react'
import classNames from 'classnames'
import SearchIcon from 'icons/SearchIcon'

interface Props {
  query: string
  setQuery: (query: string) => void
  onClose: () => void
}

export default function SearchInput({ query, setQuery, onClose }: Props) {
  // let inputProps = autocomplete.getInputProps({})
  let inputProps = {
    onKeyDown: () => console.log(query),
  }

  return (
    <div className="group relative flex h-12">
      <SearchIcon className="pointer-events-none absolute left-3 top-0 h-full w-5 stroke-zinc-500" />
      <Combobox.Input
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className={classNames(
          'flex-auto appearance-none bg-transparent pl-10 text-zinc-900 outline-none placeholder:text-zinc-500 focus:w-full focus:flex-none dark:text-white sm:text-sm [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden'
        )}
      />
    </div>
  )
}
