# TypeScript/JSX 오류 해결 가이드

다른 환경에서 TypeScript 오류가 발생할 때 시도해볼 해결 방법들:

## 1. 패키지 재설치
```bash
# node_modules와 package-lock.json 삭제
rm -rf node_modules package-lock.json
# 또는 Windows에서
rmdir /s node_modules
del package-lock.json

# 패키지 재설치
npm install
```

## 2. Next.js 캐시 클리어
```bash
rm -rf .next
# 또는 Windows에서
rmdir /s .next

npm run dev
```

## 3. TypeScript 서버 재시작 (VS Code)
- `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

## 4. Node.js 버전 확인
```bash
node --version
npm --version
```
권장 버전: Node.js 18.17+ 또는 20.x

## 5. 글로벌 TypeScript 업데이트
```bash
npm install -g typescript@latest
```

## 6. 환경 변수 확인
`.env.local` 파일이 있는지 확인

## 7. 의존성 버전 고정
package-lock.json을 commit하여 동일한 버전 사용하도록 보장
