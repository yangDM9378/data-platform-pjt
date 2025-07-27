# 📊 dataplatform-pjt

React + Flask 기반의 모니터링 데이터 플랫폼 프로젝트입니다.  
InfluxDB에서 시계열 데이터를 조회하여 UI로 시각화하고,  
패널별로 InfluxDB v1 설정을 입력 및 저장할 수 있도록 구성하였습니다.

---

## 🚀 주요 기능

- 🔐 JWT 쿠키 기반 로그인 인증 (React + Flask)
- 🧩 프론트/백엔드 구조 분리, Axios 기반 통신

---

## ⚙️ 개발환경

- **Frontend**: React 19 + Vite + TypeScript

  - Emotion (CSS-in-JS)
  - React Router v7
  - Axios 인스턴스 (`withCredentials: true`) 기반 쿠키 인증 처리
  - 구조화된 컴포넌트 분리 방식
  - 로그인 상태 유지 (JWT via Cookie)

- **Backend**: Python 3.9 + Flask
  - Flask-CORS
  - JWT 토큰을 HttpOnly 쿠키로 응답 (`make_response`, `set_cookie`)
  - 사용자 인증 해시: `werkzeug.security`
  - SQLite3 내장 DB 연동
  - DB 초기화 스크립트 (`schema.sql` + `init_db.py`)
- **DB**:
  - **SQLite**: 사용자 정보 저장 (username, password, permission 등)
  - **InfluxDB v1**: 시계열 데이터 연동

## 🏗️ 프로젝트 구조

```
dataplatform-pjt/
├── backend/ # Flask API 서버
│   ├── init_db.py            # SQLite DB 초기화 스크립트
|   ├── AuthAPI.py            # 계정 관련 API (port-5000)
│   ├── database/             # DB 관련 파일 모음
│   │   ├── config.db         # SQLite DB 파일 (자동 생성됨)
│   │   └── schema.sql        # DB 테이블 정의 파일
│   └── requirements.txt      # 백엔드 패키지 목록
├── frontend/ # React + Vite 프론트엔드
│   ├── public/
│   ├── src/
│   │   ├── pages/            # Login, Main 등 페이지
│   │   ├── components/       # 공통 컴포넌트
│   │   ├── api/axios.ts      # Axios 쿠키 통신 설정
│   │   └── main.tsx, App.tsx
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## ✅ 진행 상황

### 🛢️ DB

- [x] SQLite users Table 및 초기화 스크립트 작성
- [x] SQLite folders Table 및 초기화 스크립트 작성
- [x] SQLite dashboards Table 및 초기화 스크립트 작성
- [x] SQLite datasources Table 및 초기화 스크립트 작성
- [ ] Influxdb V1 로컬 세팅
- [ ] InfluxDB 더미 데이터 삽입

### 🧩 프론트엔드

- [x] React + Vite 초기 프로젝트 구성
- [x] 로그인 페이지 개발 및 스타일 적용
- [x] 로그인 라우팅 설정
- [ ] 사용자 전역 상태 관리 적용
- [x] 메인 페이지 레이아웃 구성
- [x] 메인 페이지 스타일링
- [ ] InfluxDB 설정 입력 UI 및 저장 기능
- [ ] NotFound 페이지 라우팅 처리

### 🧠 백엔드

- [x] Flask + SQLite 연동
- [x] JWT를 쿠키에 저장하여 인증 구현
- [x] 로그인 API 구현 (/login)
- [x] 로그인 상태 확인 API 구현 (/me)
- [ ] 회원가입 API 구현 (/register)
- [ ] 로그아웃 API 구현 (/logout)
- [x] folder-dashboard-datasource 조회 API 구현 (/tree)
- [x] influxDB folder별 alarm & run status API 구현 (/batch)
- [ ] 패널별 InfluxDB v1 설정 저장 API
- [x] InfluxDB v1 쿼리 처리 Util 구현

### 📦 기타

- [x] GitHub 초기화 및 `.gitignore` 구성
- [x] README 초안 작성
- [ ] Docker 실행 환경 구성

## 🧪 실행 방법 (예정)

```bash
# 백엔드 서버 (선택 - venv 가상서버)
cd backend
python init_db.py
python AuthAPI.py

# 프론트엔드
cd frontend
npm install
npm run dev
```
