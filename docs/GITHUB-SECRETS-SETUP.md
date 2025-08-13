# GitHub Secrets 설정 가이드

CI/CD 파이프라인이 정상적으로 작동하려면 다음 GitHub Secrets를 설정해야 합니다.

## 필수 Secrets 설정

### 1. 서버 접속 정보
- **SERVER_HOST**: 배포 서버의 IP 주소 또는 도메인
  ```
  예시: 123.456.789.012 또는 your-server.com
  ```

- **SERVER_USER**: 서버 SSH 접속 사용자명
  ```
  예시: ubuntu, root, deploy 등
  ```

- **SERVER_SSH_KEY**: 서버 접속용 SSH 개인키
  ```
  ~/.ssh/id_rsa 파일의 내용을 복사
  -----BEGIN OPENSSH PRIVATE KEY-----
  ...
  -----END OPENSSH PRIVATE KEY-----
  ```

### 2. 프로젝트 경로
- **PROJECT_PATH**: 서버에서 프로젝트가 위치할 절대 경로
  ```
  예시: /home/ubuntu/boram-pilot1
  ```

### 3. 선택사항 (권장)
- **DISCORD_WEBHOOK_URL**: 배포 알림을 받을 Discord 웹훅 URL
- **SLACK_WEBHOOK_URL**: 배포 알림을 받을 Slack 웹훅 URL

## Secrets 설정 방법

1. GitHub 저장소 페이지로 이동
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Secrets and variables** > **Actions** 클릭
4. **New repository secret** 버튼 클릭
5. 각 Secret의 Name과 Value를 입력하고 저장

## SSH Key 생성 및 설정

### 1. 로컬에서 SSH Key 생성 (이미 있다면 생략)
```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

### 2. 서버에 공개키 등록
```bash
# 공개키 내용 복사
cat ~/.ssh/id_rsa.pub

# 서버에 접속하여 authorized_keys에 추가
echo "공개키내용" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. GitHub Secrets에 개인키 등록
```bash
# 개인키 내용 복사
cat ~/.ssh/id_rsa
```
이 내용을 `SERVER_SSH_KEY` Secret에 등록

## 서버 환경 설정

### 1. Node.js 설치
```bash
# NodeSource repository 추가
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js 설치
sudo apt-get install -y nodejs

# 버전 확인
node --version
npm --version
```

### 2. PM2 글로벌 설치
```bash
sudo npm install -g pm2

# PM2 startup 설정
sudo pm2 startup
```

### 3. 필요한 디렉토리 생성
```bash
mkdir -p /home/ubuntu/boram-pilot1
chown $USER:$USER /home/ubuntu/boram-pilot1
```

## 배포 테스트

Secrets 설정 완료 후:

1. `main` 브랜치에 코드 푸시
2. **Actions** 탭에서 워크플로우 실행 확인
3. 배포 완료 후 서버에서 확인:
   ```bash
   pm2 status
   curl http://localhost:3000/api/health
   ```

## 문제 해결

### SSH 연결 실패
- SSH Key 형식 확인 (개행 문자 포함)
- 서버 방화벽 설정 확인 (포트 22)
- 서버의 SSH 설정 확인 (`/etc/ssh/sshd_config`)

### 빌드 실패
- Node.js 버전 확인 (v18 이상 권장)
- 의존성 설치 확인
- 환경 변수 설정 확인

### PM2 실행 실패
- PM2 글로벌 설치 확인
- 포트 3000 사용 여부 확인
- 프로젝트 경로 권한 확인

## 보안 고려사항

1. **SSH Key 관리**
   - 개인키는 GitHub Secrets에만 저장
   - 정기적으로 키 교체
   - 불필요한 권한 제거

2. **서버 보안**
   - 방화벽 설정
   - 불필요한 포트 차단
   - 정기적인 보안 업데이트

3. **환경 변수**
   - 민감한 정보는 서버 환경 변수로 관리
   - `.env.local` 파일 사용 권장
