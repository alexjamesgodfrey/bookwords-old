import Link from 'next/link'

interface Props {
  href: string
  children: React.ReactNode
}

export default function TopLevelNavItem({ href, children }: Props) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}
