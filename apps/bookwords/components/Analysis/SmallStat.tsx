interface Props {
  num: number | string
  label: string
}

export default function SmallStat({ num, label }: Props) {
  return (
    <div className="shadown-md m-2 flex flex-col items-center rounded-lg border px-3 py-1">
      <h3 className="m-0 p-0">{num}</h3>
      <p className="m-0 p-0 text-xs text-gray-500">{label}</p>
    </div>
  )
}
