import type { FolderItem } from "../types/structure"

type Props = {
  folder:FolderItem
}

export default function FolderCard({ folder }: Props) {
  return (
    <div>
      <h3>{folder.title}</h3>
      {folder.dashboards.map(dash => (
        <div key={dash.dashboard_uid}>
          <ul>
          </ul>
        </div>
      ))}

    </div>
  )
}
