# 📊 dataplatform-pjt

React + Flask 기반 모니터링 데이터 플랫폼 프로젝트입니다.  
InfluxDB의 데이터를 가져와 UI로 시각화 가능하도록 구현
패널 별로 Influxdb V1 세팅이 가능하도록 입력하고 개별 데이터 조회가 가능하도록 구현

---

## 🚀 주요 기능

- 🔐 **JWT 쿠키 기반 로그인** (React + Flask)

---

## ⚙️ 개발환경

- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Python 3.9 + Flask + SQLite
- **DB**:
  - SQLite (유저 정보)

## 🏗️ 프로젝트 구조

```
dataplatform-pjt/
├── backend/ # Flask API 서버
│   ├── init_db.py            # SQLite DB 초기화 스크립트
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

### 🧩 프론트엔드

- [x] React + Vite 초기화
- [ ] Login 페이지 구성
- [ ] 로그인 페이지 라우팅 구현
- [ ] Main 페이지 구성
- [ ] InfluxDB 설정 입력 기능 추가

### 🧠 백엔드

- [ ] Flask + SQLite 연동
- [ ] 쿠키에 토큰 저장
- [ ] DB 초기화 스크립트 작성
- [ ] 패널 별 Influxdb V1 설정 저장 API 구현
- [ ] InfluxDB 쿼리 기능 구현

### 📦 기타

- [x] GitHub 초기화 및 `.gitignore` 구성
- [x] README 초안 작성
- [ ] Docker 실행 환경 구성
