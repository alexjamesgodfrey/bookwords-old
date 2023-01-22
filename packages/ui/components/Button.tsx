import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import classNames from "classnames"
import Link from "next/link"

function ArrowIcon(props: any) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
      />
    </svg>
  )
}

const variantStyles = {
  primary:
    "rounded-full py-1 px-3 text-white bg-emerald-400/10 text-emerald-400 ring-1 ring-inset ring-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-300 hover:ring-emerald-300",
  secondary:
    "rounded-full bg-zinc-100 py-1 px-3 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:ring-1 dark:ring-inset dark:ring-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
  danger:
    "rounded-full py-1 px-3 text-white bg-red-400/10 text-red-400 ring-1 ring-inset ring-red-400/20 hover:bg-red-400/10 hover:text-red-300 hover:ring-red-300",
  info: "rounded-full py-1 px-3 text-white bg-blue-400/10 text-blue-400 ring-1 ring-inset ring-blue-400/20 hover:bg-blue-400/10 hover:text-blue-300 hover:ring-blue-300",
  filled:
    "rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400",
  outline:
    "rounded-full py-1 px-3 text-zinc-700 ring-1 ring-inset ring-zinc-900/10 hover:bg-zinc-900/2.5 hover:text-zinc-900 dark:text-zinc-400 dark:ring-white/10 dark:hover:bg-white/5 dark:hover:text-white",
  text: "text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-500",
}

interface Props {
  variant?: keyof typeof variantStyles
  className?: string
  children: React.ReactNode
  arrow?: "left" | "right" | "up" | "diagonal"
  href?: string
  onClick?: () => void
}

export function Button({
  variant = "primary",
  className,
  children,
  arrow,
  onClick,
  ...props
}: Props) {
  let Component = props.href ? Link : "button"

  className = classNames(
    "inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition flex",
    variantStyles[variant],
    className
  )

  let arrowIcon =
    arrow === "diagonal" ? (
      <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-0.5 mt-[0.07rem]" />
    ) : (
      <ArrowIcon
        className={classNames(
          "h-5 w-5",
          variant === "text" && "relative top-px",
          arrow === "left" && "-ml-1 rotate-180",
          arrow === "up" && "rotate-[-90deg]",
          arrow === "right" && "-mr-1"
        )}
      />
    )

  return (
    <Component href={""} className={className} {...props} onClick={onClick}>
      {arrow === "left" && arrowIcon}
      {children}

      {arrow && arrowIcon}
    </Component>
  )
}
