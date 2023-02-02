import logo from 'images/logo.svg'
import Image from 'next/image'

interface Props {
  className?: string
}

export function Logo({ className }: Props) {
  return <Image src={logo} alt="Bookwords" width={32} height={32} className={className} />
}
