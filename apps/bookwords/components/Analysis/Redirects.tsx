import StatsIcon from 'icons/StatsIcon'
import Link from 'next/link'

const redirects = [{ label: 'Spotify', icon: StatsIcon }]

export default function Redirects() {
  return (
    <section className="mt-4 lg:mt-6">
      <h2 className="sr-only flex items-center font-mono text-sm font-medium leading-7 text-slate-900 lg:not-sr-only">
        <StatsIcon
          colors={['fill-indigo-300', 'fill-blue-300']}
          className="h-2.5 w-2.5"
        />
        <span className="ml-2.5 dark:text-zinc-200">Read</span>
      </h2>
      <div className="h-px bg-gradient-to-r from-slate-200/0 via-slate-200 to-slate-200/0 lg:hidden" />
      <ul
        role="list"
        className="mt-4 flex justify-center gap-10 text-base font-medium leading-7 text-slate-700 sm:gap-8 lg:flex-col lg:gap-4"
      >
        {redirects.map((redirect) => (
          <li key={redirect.label} className="flex">
            <Link
              href="/"
              className="group flex items-center"
              aria-label={redirect.label}
            >
              <redirect.icon className="h-8 w-8 fill-slate-400 group-hover:fill-slate-600" />
              <span className="hidden sm:ml-3 sm:block">{redirect.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
