# TypeScript/JSX 오류 해결 가이드

다른 환경에서 TypeScript 오류가 발생할 때 시도해볼 해결 방법들:

## 1. next-env.d.ts 파일 확인/복구
**업데이트**: 이 파일은 이제 Git 저장소에 포함되어 있습니다.

```typescript
// next-env.d.ts 파일이 프로젝트 루트에 있어야 함
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

**해결 방법**:
```bash
# 1. Git에서 최신 코드 받기
git pull

# 2. Next.js 개발 서버 실행 (파일이 없으면 자동 생성)
npm run dev
```

## 2. 패키지 재설치
```bash
# node_modules와 package-lock.json 삭제
rm -rf node_modules package-lock.json
# 또는 Windows에서
rmdir /s node_modules
del package-lock.json

# 패키지 재설치
npm install
```

## 3. Next.js 캐시 클리어
```bash
rm -rf .next
# 또는 Windows에서
rmdir /s .next

npm run dev
```

## 4. TypeScript 서버 재시작 (VS Code)
- `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

## 5. Node.js 버전 확인
```bash
node --version
npm --version
```
권장 버전: Node.js 18.17+ 또는 20.x

## 6. 글로벌 TypeScript 업데이트
```bash
npm install -g typescript@latest
```

## 7. 환경 변수 확인
`.env.local` 파일이 있는지 확인

## 8. 의존성 버전 고정
package-lock.json을 commit하여 동일한 버전 사용하도록 보장

## 🚀 권장 해결 순서
1. `git pull` (최신 코드 받기)
2. `npm install` (패키지 설치)
3. `npm run dev` (개발 서버 실행)
4. VS Code에서 TypeScript 서버 재시작
