import type { FolderItem, DashboardStatusInfo } from "../types/structure"
import StatusInfo from "./StatusInfo"

type Props = {
  folder: FolderItem
  statusInfo?: DashboardStatusInfo
}

export default function FolderCard({ folder, statusInfo }: Props) {
  const displayInfo = statusInfo || {
    status: 'LOADING',
    runtime: '-'
  }

  return (
    <div>
      <h3>{folder.title}</h3>
      <div>{folder.folder_sub_title}</div>
      <StatusInfo status={displayInfo.status} />
      <div>RUNTIME: {displayInfo.runtime}</div>
    </div>
  )
}
