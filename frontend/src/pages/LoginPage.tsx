import { useState } from 'react'
import authApi from '../api/authApi'
import { useNavigate } from 'react-router-dom'
import { css, keyframes } from '@emotion/react'
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
    <div css={containerStyle}>
      <div css={loginBoxStyle}>
        <div css={headerStyle}>
          <div css={headertitleStyle}>Header Title</div>
          <h1 css={titleStyle}>Title</h1>
          <div css={subtitleStyle}>Sub Title</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div css={formStyle}>
            <div>
              <label htmlFor="username" css={labelStyle}>사용자 아이디</label>
              <input
                type="text"
                name="username"
                placeholder="아이디를 입력하세요"
                value={payload.username}
                onChange={handleChange}
                css={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="password" css={labelStyle}>비밀번호</label>
              <input
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                value={payload.password}
                onChange={handleChange}
                css={inputStyle}
              />
            </div>
          </div>
          <p css={errorStyle}>{error ?? ' '}</p>
          <button type="submit" css={loginButtonStyle}>
            로그인
          </button>
        </form>
      </div>
    </div>
  )
}

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`
const containerStyle = css`
  background: linear-gradient(135deg, #1e293b, #1f2f46, #1e293b);
  /* background: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.02), transparent 40%), #1e293b; */
  /* background: url('/assets/bg.jpg') no-repeat center center;
  background-size: cover; */
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`
const loginBoxStyle = css`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 60px;
  width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: ${slideUp} 0.8s ease-out;
`
const headerStyle = css`
  text-align: center;
  margin-bottom: 40px;
`
const headertitleStyle = css`
  color: #ecf0f1;
  font-size: 14px;
  letter-spacing: 2px;
  opacity: 0.8;
  margin-bottom: 10px;
`
const titleStyle = css`
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
`
const subtitleStyle = css`
  color: #bdc3c7;
  font-size: 18px;
  font-weight: 300;
`
const formStyle = css`
  display: flex;
  flex-direction: column;
  gap: 25px;
`
const labelStyle = css`
  display: block;
  color: #ecf0f1;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
`
const inputStyle = css`
  box-sizing: border-box;
  width: 100%;
  padding: 18px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    background: rgba(255, 255, 255, 0.15);
    border-color: #3498db;
    box-shadow: 0 0 20px rgba(52, 152, 219, 0.2);
    transform: translateY(-2px);
  }
`
const errorStyle = css`
  color: #f87171;
  font-size: 14px;
`
const loginButtonStyle = css`
  width: 100%;
  padding: 18px;
  background: #475569;
  color: #fff;
  border: 1px solid #64748b;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;

  &:hover {
    background: #64748b;
    transform:  translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
  `