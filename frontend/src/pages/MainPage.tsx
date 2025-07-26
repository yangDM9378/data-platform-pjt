import { useEffect, useState } from "react"
import authApi from "../api/authApi"
import { useNavigate } from "react-router-dom"
import structureApi from '../api/structureApi'

import type { UserInfo } from '../types/auth'
import type { StructureItem } from '../types/structure'
import FolderCard from "../components/FolderCard"

export default function MainPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [structure, setStructure] = useState<StructureItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserAndStructure = async () => {
      try {
        const res = await authApi.get('/me')
        setUserInfo(res.data)
      } catch (err: any) {
        setError(err.response?.data?.message || '사용자 정보를 불러올 수 없습니다.')
        navigate('/login')
        return
      }
      try {
        const structureRes = await structureApi.get('/tree')
        setStructure(structureRes.data)
      } catch (err:any) {
        setError(err.response?.data?.message || '전체 구조 정보를 불러오는 데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }
    fetchUserAndStructure()
  }, [navigate])
  
  if (loading || !userInfo) return <p>로딩 중...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <header>
        <div>
          <div>Header Title</div>
          <div>Title </div>
        </div>
        <div>
          <div>
            3/7 
            <br />Running
          </div>
          <div>
            3 
            <br />ALERTS
          </div>
        </div>
      </header>
      <main>
        {structure.map(parent => (
          <section key={parent.parent}>
            <h2>{parent.parent}</h2>
            <div>
              {parent.folders.map(folder => (
                <FolderCard key={folder.folder_uid} folder={folder}/>
              ))}
            </div>
          </section>
        ))}
      </main>
      {/* <p><strong>접속자:</strong> {userInfo.user}</p>
      <p><strong>권한:</strong> {userInfo.permission}</p> */}
    </div>
  )
}
