import { useEffect, useState } from "react"
import authApi from "../api/authApi"
import { useNavigate } from "react-router-dom"
import type { UserInfo } from "../types/auth"

export default function MainPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authApi.get('/me', {withCredentials:true})
        setUserInfo(res.data)
      } catch (err: any) {
        setError(err.response?.data?.message || '사용자 정보를 불러올 수 없습니다.')
        navigate('/login')
      }
    }
    fetchUser()
  }, [navigate])
  
  if (!userInfo) return <p>로딩 중...</p>

  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h2>메인 페이지</h2>
      <p><strong>접속자:</strong> {userInfo.user}</p>
      <p><strong>권한:</strong> {userInfo.permission}</p>
    </div>
  )
}
