import { Popover, Transition } from '@headlessui/react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import clsx from 'clsx'
import TopLevelNavItem from 'components/Header/TopLevelNavItem'
import { Container } from 'components/Home/Container'
import AuthPopup from 'components/Login/AuthPopup'
import Search from 'components/Search'
import logo from 'images/logo.svg'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import { Database } from 'types/supabase'
import { Button } from 'ui'

function MobileNavLink({ href, children }: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Popover.Button as={Link} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  )
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0'
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0'
        )}
      />
    </svg>
  )
}

function MobileNavigation() {
  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <MobileNavLink href="#features">Features</MobileNavLink>
            <MobileNavLink href="#testimonials">Testimonials</MobileNavLink>
            <MobileNavLink href="#pricing">Pricing</MobileNavLink>
            <hr className="m-2 border-slate-300/40" />
            <MobileNavLink href="/login">Sign in</MobileNavLink>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  )
}

export function Header() {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()

  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      <AuthPopup show={showLogin} setShow={setShowLogin} />
      <header className="py-10">
        <Container className="">
          <nav className="relative z-50 flex justify-between">
            <div className="flex items-center md:gap-x-8">
              <Link href="#" aria-label="Home">
                <div className="flex items-center">
                  <Image src={logo} alt="Bookwords" width={32} height={32} />
                  <p className="ml-4 font-semibold">Bookwords.org</p>
                </div>
              </Link>

            </div>
            <Search />
            <div className="flex items-center gap-x-5 md:gap-x-8">
              <nav className="hidden md:block">
                <ul role="list" className="flex items-center gap-2 lg:gap-4">
                  <TopLevelNavItem href="#">About</TopLevelNavItem>
                  <TopLevelNavItem href="#">Charts</TopLevelNavItem>
                  <TopLevelNavItem href="/">Contribute</TopLevelNavItem>
                  <TopLevelNavItem href="#">API Docs</TopLevelNavItem>
                </ul>
              </nav>
              {user ? (
                <>
                  {/* @ts-ignore */}
                  <Button
                    variant="danger"
                    // @ts-ignore
                    onClick={() => supabase.auth.signOut()}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  arrow="right"
                  onClick={() => setShowLogin(true)}
                >
                  Sign in
                </Button>
              )}
              <div className="-mr-1 md:hidden">
                <MobileNavigation />
              </div>
            </div>
          </nav>
        </Container>
      </header>
    </>
  )
}
