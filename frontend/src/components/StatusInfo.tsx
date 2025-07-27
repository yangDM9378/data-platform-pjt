type Props = {
  status: 'RUNNING' | 'ALARM' | 'STABLE' | 'LOADING' | string
}

export default function StatusInfo({ status }: Props) {
  return (
    <div>
      {status}
    </div>
  )
}
