import { Combobox } from '@headlessui/react'
import classNames from 'classnames'
import posterImage from 'images/poster.png'
import Image from 'next/image'
import { useId } from 'react'
import SearchItem from 'types/SearchItem'

interface Props {
  result: SearchItem
  resultIndex: number
}

export default function SearchResult({ result, resultIndex }: Props) {
  let id = useId()

  // console.log('result', result)

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
            'flex cursor-pointer items-center px-4 py-2 relative'
          )}
          aria-labelledby={`${id}-hierarchy ${id}-title`}
        >
          {result.native && <span className='bg-emerald-200 text-sm uppercase font-bold text-current p-0.5 rounded-md shadow absolute top-4 right-4'>analyzed</span>}
          <Image
            className="mr-2 rounded-sm bg-slate-200 shadow-xl shadow-slate-400 dark:shadow-slate-600"
            src={result.url || posterImage}
            alt=""
            sizes="(min-width: 1024px) 20rem, (min-width: 640px) 16rem, 12rem"
            width={40}
            height={40}
            priority
          />
          <div className="ml-2">
            <p className="font-bold text-lg text-slate-900 dark:text-zinc-200">
              {result.title}
            </p>
            {/* {result.authors ? (
              <p>by {result.authors.join(', ')}</p>
            ) : (
              <p>No authors found</p>
            )} */}
          </div>
        </li>
      )}
    </Combobox.Option>
  )
}
