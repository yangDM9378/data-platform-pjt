import { useState } from 'react'
import authApi from '../api/authApi'
import { useNavigate } from 'react-router-dom'
import type { LoginPayload } from '../types/auth'

export default function LoginPage() {
  const [payload, setPayload] = useState<LoginPayload>({ username: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPayload(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!payload.username || !payload.password) {
      setError('아이디와 비밀번호를 모두 입력하세요.')
      return
    }
    try {
      await authApi.post('/login', payload)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인 실패')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '100px auto' }}>
      <h2>로그인</h2>
      <input
        type="text"
        name="username"
        placeholder="아이디"
        value={payload.username}
        onChange={handleChange}
      /><br />
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        value={payload.password}
        onChange={handleChange}
      /><br />
      <button type="submit">
        로그인
      </button>
      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
    </form>
  )
}
