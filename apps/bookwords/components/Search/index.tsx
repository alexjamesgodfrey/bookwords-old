import SearchDialog from 'components/Search/SearchDialog'
import SearchIcon from 'icons/SearchIcon'
import { useEffect, useRef, useState } from 'react'

function useSearchProps() {
  let buttonRef = useRef()
  let [open, setOpen] = useState(false)

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true)
      },
    },
    dialogProps: {
      open,
      setOpen(open: boolean) {
        // @ts-ignore
        let { width, height } = buttonRef.current.getBoundingClientRect()
        if (!open || (width !== 0 && height !== 0)) {
          setOpen(open)
        }
      },
    },
  }
}

export default function Search() {
  let [modifierKey, setModifierKey] = useState('')
  let { buttonProps, dialogProps } = useSearchProps()

  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl '
    )
  }, [])

  return (
    <>
      {/* @ts-ignore */}
      <button
        type="button"
        className="flex w-64 h-8 sm:w-96 items-center gap-2 rounded-full pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20  dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 focus:[&:not(:focus-visible)]:outline-none"
        {...buttonProps}
      >
        <SearchIcon className="h-5 w-5 stroke-current" />
        <p>Find a book...
          {/* <kbd className="text-2xs ml-auto text-zinc-400 dark:text-zinc-500">
            <kbd className="font-sans">{modifierKey}</kbd>
            <kbd className="font-sans">K</kbd>
          </kbd> */}
        </p>
      </button>
      <SearchDialog className="lg:block" {...dialogProps} />
    </>
  )
}
