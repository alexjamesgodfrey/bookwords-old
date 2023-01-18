import classNames from 'classnames'
import StatsIcon from 'icons/StatsIcon'
import { useState } from 'react'
import ReactHTMLParser from 'react-html-parser'

interface Props {
  description: string
  className?: string
}

export default function AboutSection({
  description,
  className,
  ...props
}: Props) {
  let [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="mt-6" {...props}>
      <h2 className="flex items-center font-mono text-sm font-medium leading-7 text-slate-900">
        <StatsIcon
          colors={['fill-violet-300', 'fill-pink-300']}
          className="h-2.5 w-2.5"
        />
        <span className="ml-2.5 dark:text-zinc-200">About</span>
      </h2>
      <p
        className={classNames(
          'mt-2 text-base leading-7 text-slate-700 dark:text-zinc-400',
          !isExpanded && 'lg:line-clamp-4'
        )}
      >
        {ReactHTMLParser(description)}
      </p>
      {!isExpanded ? (
        <button
          type="button"
          className="mt-2 hidden text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900 lg:inline-block"
          onClick={() => setIsExpanded(true)}
        >
          Show more
        </button>
      ) : (
        <button
          type="button"
          className="mt-2 hidden text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900 lg:inline-block"
          onClick={() => setIsExpanded(false)}
        >
          Show less
        </button>
      )}
    </section>
  )
}
