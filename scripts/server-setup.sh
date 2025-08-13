#!/bin/bash

# 서버 초기 설정 스크립트
# 이 스크립트는 서버에서 한 번만 실행하면 됩니다.

echo "🚀 Boram Pilot1 서버 초기 설정 시작..."

# PM2 설치 (글로벌)
echo "📦 PM2 설치 중..."
sudo npm install -g pm2

# PM2 시작 스크립트 생성
echo "📝 PM2 설정 파일 생성 중..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'boram-pilot1',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# 로그 디렉토리 생성
mkdir -p logs

# PM2 startup 설정
echo "⚙️ PM2 startup 설정 중..."
pm2 startup
pm2 save

# 방화벽 설정 (포트 3000 열기)
echo "🔓 방화벽 설정 중..."
sudo ufw allow 3000

echo "✅ 서버 초기 설정 완료!"
echo "이제 GitHub에서 배포 시크릿을 설정해주세요:"
echo "1. SERVER_HOST: 서버 IP 주소"
echo "2. SERVER_USER: SSH 사용자명 (보통 ubuntu)"
echo "3. SERVER_SSH_KEY: SSH 개인키"
echo "4. SERVER_PORT: SSH 포트 (기본값: 22)"
echo "5. PROJECT_PATH: 프로젝트 경로 (예: /home/ubuntu/boram-pilot1)"
