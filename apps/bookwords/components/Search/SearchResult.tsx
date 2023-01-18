import { Combobox } from '@headlessui/react'
import classNames from 'classnames'
import posterImage from 'images/poster.png'
import Image from 'next/image'
import { useId } from 'react'
import { GoogleBookItem } from 'types/GoogleBooks'

interface Props {
  result: GoogleBookItem
  resultIndex: number
}

export default function SearchResult({ result, resultIndex }: Props) {
  let id = useId()

  return (
    <Combobox.Option
      key={result.id}
      value={result}

      // {...autocomplete.getItemProps({
      // item: result,
      // source: collection.source,
      // })}
    >
      {({ active }) => (
        <li
          className={classNames(
            { 'bg-zinc-50 dark:bg-zinc-800/50': active },
            {
              'border-t border-zinc-100 dark:border-zinc-800': resultIndex > 0,
            },
            'flex cursor-pointer items-center px-4 py-3 '
          )}
          aria-labelledby={`${id}-hierarchy ${id}-title`}
        >
          <Image
            className="mr-2 rounded-sm bg-slate-200 shadow-xl shadow-slate-400 dark:shadow-slate-600"
            src={result.volumeInfo.imageLinks?.thumbnail || posterImage}
            alt=""
            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
            width={40}
            height={40}
            priority
          />
          <div className="ml-2">
            <p className="font-bold text-slate-900 dark:text-zinc-200">
              {result.volumeInfo.title}
            </p>
            {result.volumeInfo.authors ? (
              <p>by {result.volumeInfo.authors.join(', ')}</p>
            ) : (
              <p>No authors found</p>
            )}
          </div>
        </li>
      )}
    </Combobox.Option>
  )
}
