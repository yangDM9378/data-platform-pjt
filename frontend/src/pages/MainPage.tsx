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
    const interval = setInterval(fetchStatusMap, 10000)
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

  if (loading || !userInfo) return <p>로딩 중...</p>
  if (error) return <p>{error}</p>

  return (
    <div css={pageContatinerStyle}>
      <header>
        <div>
          <div>KOREA UNIVERSITY</div>
          <div>ECO FAB MONITORING SYSTEM</div>
        </div>
        <div>
          <div>
            {globalStats.running}/{globalStats.total}
            <br />
            RUNNING
          </div>
          <div>
            {globalStats.alarm}
            <br />
            ALERTS
          </div>
        </div>
      </header>

      <main>
        {structure.map(parent => {
          const fabTotal = parent.folders.length
          const fabRunning = parent.folders.filter(folder => statusMap[folder.title]?.status === "RUNNING").length
          const runningRate = fabTotal > 0 ? Math.round((fabRunning / fabTotal) * 100) : 0

          return (
            <section key={parent.parent}>
              <div>
                <div>SEMICONDUCTOR FACILITY</div>
                <h2>{parent.parent}</h2>
                <div>{runningRate}% RUNNING</div>
              </div>
              <div>
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
