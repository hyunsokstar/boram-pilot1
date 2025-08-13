# 🌟 보람 관리자 페이지 (Boram Admin Panel)

모던한 웹 기반 관리자 시스템으로, 효율적인 데이터 관리와 사용자 경험을 제공합니다.

## 📋 프로젝트 개요

- **프로젝트명**: 보람 관리자 페이지 (Boram Pilot 1)
- **목적**: 통합 관리 시스템 구축
- **개발 기간**: 2025년 8월
- **버전**: v0.1.0

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15.4.6 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand 5.0.7
- **HTTP Client**: Axios 1.11.0
- **UI Components**: Radix UI, Lucide React
- **Form Handling**: React Hook Form + Zod

### Architecture
- **Design Pattern**: Feature-Sliced Design (FSD)
- **Code Structure**: Layer-based organization
- **State Management**: Global store with persistence

### DevOps & Deployment
- **Process Manager**: PM2
- **CI/CD**: GitHub Actions
- **Build Tool**: Next.js Build
- **Environment**: Node.js 20.x

## 🚀 주요 기능

### ✅ 구현 완료
- 🔐 **사용자 인증 시스템**
  - 로그인/로그아웃
  - 보호된 라우트
  - 상태 관리

- 🎨 **모던 UI/UX**
  - 반응형 디자인
  - 다크/라이트 테마
  - 그라디언트 디자인
  - 애니메이션 효과

- 📱 **리사이저블 사이드바**
  - 동적 크기 조절
  - 트리 메뉴 구조
  - 상태 유지

- 🏗️ **아키텍처**
  - FSD 구조 적용
  - 타입 안전성
  - 모듈화된 코드

### 🔄 CI/CD 파이프라인
- 자동 빌드 & 테스트
- PM2 배포 자동화
- 헬스체크 모니터링
- 롤백 지원

## 📁 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes
│   ├── globals.css     # Global Styles
│   ├── layout.tsx      # Root Layout
│   └── page.tsx        # Home Page
├── shared/             # 공유 리소스 (FSD)
│   ├── api/           # API 클라이언트
│   ├── config/        # 설정 파일
│   └── ui/            # 공통 UI 컴포넌트
├── features/          # 기능별 모듈 (FSD)
│   └── auth/          # 인증 기능
└── widgets/           # 위젯 컴포넌트 (FSD)
    └── common-sidebar/ # 사이드바 위젯
```

## 🏃‍♂️ 개발 환경 설정

### 1. 프로젝트 클론
```bash
git clone https://github.com/hyunsokstar/boram-pilot1.git
cd boram-pilot1
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 브라우저에서 확인
- [http://localhost:3000](http://localhost:3000)

## 📦 주요 스크립트

```bash
# 개발 환경
npm run dev              # 개발 서버 시작 (Turbopack)

# 빌드 & 배포
npm run build            # 프로덕션 빌드
npm run build:production # 프로덕션 환경 빌드
npm run start            # 프로덕션 서버 시작

# PM2 관리
npm run pm2:start        # PM2로 앱 시작
npm run pm2:restart      # PM2 앱 재시작
npm run pm2:stop         # PM2 앱 중지
npm run pm2:logs         # PM2 로그 확인

# 기타
npm run lint             # ESLint 검사
npm run health-check     # 헬스체크 API 호출
```

## 🚀 배포 가이드

### 수동 배포
```bash
npm run deploy:manual
```

### 자동 배포 (CI/CD)
1. `main` 브랜치에 코드 푸시
2. GitHub Actions 자동 실행
3. 배포 완료 후 알림

자세한 배포 설정은 [GitHub Secrets 설정 가이드](./docs/GITHUB-SECRETS-SETUP.md)를 참고하세요.

## 🔍 모니터링

### 헬스체크
```bash
curl http://localhost:3000/api/health
```

### PM2 상태 확인
```bash
pm2 status
pm2 logs boram-pilot1
```

### 배포 모니터링
```bash
./scripts/monitor-deployment.sh
```

## 🎯 향후 계획

- [ ] 대시보드 기능 추가
- [ ] 데이터 관리 모듈
- [ ] 통계 및 분석 기능
- [ ] 권한 관리 시스템
- [ ] 알림 시스템

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 Issues를 통해 등록해주세요.

---

**Made with ❤️ for Boram Admin System**
