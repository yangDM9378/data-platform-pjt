import { useEffect, useState } from "react"
import { css, keyframes } from '@emotion/react'
import authApi from "../api/authApi"
import { getStructureTree, postBatchStatus } from "../api/structureApi"
import { useNavigate } from "react-router-dom"

import type { UserInfo } from "../types/auth"
import type { StructureItem, DashboardStatusMap } from "../types/structure"
import FolderCard from "../components/FolderCard"

type GlobalStats = {
  total: number
  running: number
  alarm: number
}

export default function MainPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [structure, setStructure] = useState<StructureItem[]>([])
  const [statusMap, setStatusMap] = useState<DashboardStatusMap>({})
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    total: 0,
    running: 0,
    alarm: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserAndStructure = async () => {
      try {
        const res = await authApi.get("/me")
        setUserInfo(res.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "사용자 정보를 불러올 수 없습니다.")
        navigate("/login")
        return
      }

      try {
        const structureRes = await getStructureTree()
        setStructure(structureRes.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "전체 구조 정보를 불러오는 데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndStructure()
  }, [navigate])

  useEffect(() => {
    if (structure.length === 0) return
    const fetchStatusMap = async () => {
      try {
        const res = await postBatchStatus(structure)
        setStatusMap(res.data)
      } catch (err) {
        console.error("상태 정보를 불러오는 데 실패했습니다.", err)
      }
    }

    fetchStatusMap()
    const interval = setInterval(fetchStatusMap, 1000)
    return () => clearInterval(interval)
  }, [structure])

  useEffect(() => {
    if (structure.length === 0 || Object.keys(statusMap).length === 0) return

    let running = 0
    let alarm = 0
    let total = 0

    structure.forEach(parent => {
      parent.folders.forEach(folder => {
        total += 1
        const info = statusMap[folder.title]
        if (!info) return
        if (info.status === "RUNNING") running += 1
        if (info.status === "ALARM") alarm += 1
      })
    })

    setGlobalStats({ total, running, alarm })
  }, [structure, statusMap])

  if (loading || !userInfo) return <div css={loadingStyle}>로딩 중...</div>
  if (error) return <div css={errorStyle}>{error}</div>

  return (
    <div css={containerStyle}>
      <header css={headerStyle}>
        <div css={headerLeftStyle}>
          <div css={universityStyle}>sub title</div>
          <div css={systemTitleStyle}>title</div>
        </div>
        <div css={headerRightStyle}>
          <div css={statBoxStyle}>
            <div css={statNumberStyle}>
              {globalStats.running}/{globalStats.total}
            </div>
            <div css={statLabelStyle}>RUNNING</div>
          </div>
          <div css={[statBoxStyle, alertBoxStyle]}>
            <div css={[statNumberStyle, alertNumberStyle]}>
              {globalStats.alarm}
            </div>
            <div css={statLabelStyle}>ALERTS</div>
          </div>
        </div>
      </header>

      <main css={mainStyle}>
        {structure.map(parent => {
          const fabTotal = parent.folders.length
          const fabRunning = parent.folders.filter(folder => statusMap[folder.title]?.status === "RUNNING").length
          const runningRate = fabTotal > 0 ? Math.round((fabRunning / fabTotal) * 100) : 0

          return (
            <section key={parent.parent} css={sectionStyle}>
              <div css={sectionHeaderStyle}>
                <div css={facilityInfoStyle}>
                  <div css={facilityLabelStyle}>SEMICONDUCTOR FACILITY</div>
                  <h2 css={facilityNameStyle}>{parent.parent}</h2>
                </div>
                <div css={runningRateStyle}>{runningRate}% RUNNING</div>
              </div>
              <div css={cardsContainerStyle}>
                {parent.folders.map(folder => (
                  <FolderCard
                    key={folder.folder_uid}
                    folder={folder}
                    statusInfo={statusMap[folder.title]}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}

// Animations
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

// Styles
const containerStyle = css`
  min-height: 100vh;
  padding: 0px 40px;
  animation: ${fadeIn} 0.8s ease-out;
`

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 30px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${slideUp} 0.8s ease-out;
`

const headerLeftStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const universityStyle = css`
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
`

const systemTitleStyle = css`
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
`

const headerRightStyle = css`
  display: flex;
  gap: 20px;
`

const statBoxStyle = css`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  padding: 12px 20px;
  text-align: center;
  min-width: 80px;
  backdrop-filter: blur(10px);
`

const alertBoxStyle = css`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
`

const statNumberStyle = css`
  color: #22c55e;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 2px;
`

const alertNumberStyle = css`
  color: #ef4444;
`

const statLabelStyle = css`
  color: #94a3b8;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1px;
`

const mainStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`

const sectionStyle = css`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 30px;
  animation: ${slideUp} 0.8s ease-out;
`

const sectionHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const facilityLabelStyle = css`
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: block;
`

const facilityNameStyle = css`
  color: #ffffff;
  font-size: 32px;
  font-weight: 700;
  margin: 8px 0 0 0;
`

const facilityInfoStyle = css`
  display: flex;
  flex-direction: column;
`

const runningRateStyle = css`
  color: #22c55e;
  font-size: 14px;
  font-weight: 600;
  background: rgba(34, 197, 94, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(34, 197, 94, 0.3);
  letter-spacing: 0.5px;
`

const cardsContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`

const loadingStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #ffffff;
  font-size: 18px;
  font-weight: 500;
`

const errorStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #ef4444;
  font-size: 18px;
  font-weight: 500;
`