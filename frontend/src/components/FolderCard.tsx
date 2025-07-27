import { css } from '@emotion/react'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return '#22c55e'
      case 'ALARM':
        return '#ef4444'
      case 'STABLE':
        return '#64748b'
      default:
        return '#64748b'
    }
  }

  const getCardStyle = (status: string) => {
    const baseStyle = cardStyle
    if (status === 'ALARM') {
      return css`
        ${baseStyle}
        border-top: 3px solid #ef4444;
      `
    }
    if (status === 'RUNNING') {
      return css`
        ${baseStyle}
        border-top: 3px solid #22c55e;
      `
    }
    return css`
      ${baseStyle}
      border-top: 3px solid #64748b;
    `
  }

  return (
    <div css={getCardStyle(displayInfo.status)}>
      <div css={cardHeaderStyle}>
        <h3 css={titleStyle}>{folder.title}</h3>
        <div css={statusBadgeStyle(displayInfo.status)}>
          {displayInfo.status}
        </div>
      </div>
      <div css={subtitleStyle}>{folder.folder_sub_title}</div>
      <div css={runtimeStyle}>RUNTIME: {displayInfo.runtime}</div>
    </div>
  )
}

const cardStyle = css`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
`

const cardHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
`

const titleStyle = css`
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
`

const statusBadgeStyle = (status: string) => {
  const getStatusColor = () => {
    switch (status) {
      case 'RUNNING':
        return {
          bg: '#22c55e',
          border: '#16a34a',
          text: '#ffffff'
        }
      case 'ALARM':
        return {
          bg: '#ef4444',
          border: '#dc2626',
          text: '#ffffff'
        }
      case 'STABLE':
        return {
          bg: '#64748b',
          border: '#475569',
          text: '#ffffff'
        }
      default:
        return {
          bg: '#64748b',
          border: '#475569',
          text: '#ffffff'
        }
    }
  }

  const colors = getStatusColor()
  
  return css`
    background: ${colors.bg};
    border: 1px solid ${colors.border};
    color: ${colors.text};
    font-size: 11px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  `
}

const subtitleStyle = css`
  color: #94a3b8;
  font-size: 13px;
  font-weight: 400;
  margin-bottom: 8px;
`

const runtimeStyle = css`
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 500;
  margin-top: auto;
  letter-spacing: 0.5px;
`