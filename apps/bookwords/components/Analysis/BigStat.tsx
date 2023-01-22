interface Props {
  num: number | string
  label: string
}

export default function BigStat({ num, label }: Props) {
  return (
    <div className="shadown-md m-2 flex flex-col items-center rounded-lg border px-6 py-2">
      <h1 className="m-0 p-0">{num}</h1>
      <p className="m-0 p-0 text-sm text-gray-500">{label}</p>
    </div>
  )
}
