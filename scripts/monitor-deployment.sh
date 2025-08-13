#!/bin/bash

# 배포 상태 모니터링 스크립트
# 사용법: ./scripts/monitor-deployment.sh

set -e

PROJECT_NAME="boram-pilot1"
HEALTH_CHECK_URL="http://localhost:3000/api/health"
MAX_RETRIES=30
RETRY_INTERVAL=5

echo "🔍 배포 상태 모니터링 시작..."
echo "프로젝트: $PROJECT_NAME"
echo "헬스체크 URL: $HEALTH_CHECK_URL"
echo "최대 재시도: $MAX_RETRIES"
echo "재시도 간격: ${RETRY_INTERVAL}초"
echo "=================================="

# PM2 프로세스 상태 확인
check_pm2_status() {
    echo "📊 PM2 프로세스 상태 확인..."
    if pm2 describe $PROJECT_NAME > /dev/null 2>&1; then
        pm2 describe $PROJECT_NAME | grep -E "(status|uptime|restarts|memory|cpu)"
        return 0
    else
        echo "❌ PM2 프로세스를 찾을 수 없습니다."
        return 1
    fi
}

# 헬스체크 API 확인
check_health_endpoint() {
    local retry_count=0
    
    echo "🏥 헬스체크 API 확인..."
    
    while [ $retry_count -lt $MAX_RETRIES ]; do
        if curl -f -s $HEALTH_CHECK_URL > /dev/null; then
            echo "✅ 헬스체크 성공!"
            
            # 헬스체크 상세 정보 출력
            echo "📋 헬스체크 상세 정보:"
            curl -s $HEALTH_CHECK_URL | python3 -m json.tool
            return 0
        else
            retry_count=$((retry_count + 1))
            echo "⏳ 헬스체크 실패 (시도: $retry_count/$MAX_RETRIES). ${RETRY_INTERVAL}초 후 재시도..."
            sleep $RETRY_INTERVAL
        fi
    done
    
    echo "❌ 헬스체크 최대 재시도 횟수 초과"
    return 1
}

# 포트 사용 상태 확인
check_port_usage() {
    echo "🔌 포트 사용 상태 확인..."
    
    if netstat -tulpn | grep :3000 > /dev/null; then
        echo "✅ 포트 3000이 사용 중입니다."
        netstat -tulpn | grep :3000
    else
        echo "❌ 포트 3000이 사용되지 않습니다."
        return 1
    fi
}

# 로그 확인
check_logs() {
    echo "📝 최근 로그 확인..."
    
    if pm2 describe $PROJECT_NAME > /dev/null 2>&1; then
        echo "--- PM2 로그 (최근 20줄) ---"
        pm2 logs $PROJECT_NAME --lines 20 --nostream
    else
        echo "❌ PM2 프로세스를 찾을 수 없어 로그를 확인할 수 없습니다."
    fi
}

# 메모리 사용량 확인
check_memory_usage() {
    echo "💾 시스템 메모리 사용량 확인..."
    free -h
    
    echo ""
    echo "🔍 Node.js 프로세스 메모리 사용량:"
    ps aux | grep -E "(node|PM2)" | grep -v grep
}

# 디스크 사용량 확인
check_disk_usage() {
    echo "💿 디스크 사용량 확인..."
    df -h /
}

# 메인 실행
main() {
    echo "🚀 배포 모니터링 시작 시간: $(date)"
    echo ""
    
    # 각 체크 함수 실행
    check_pm2_status
    echo ""
    
    check_port_usage
    echo ""
    
    check_health_endpoint
    echo ""
    
    check_memory_usage
    echo ""
    
    check_disk_usage
    echo ""
    
    check_logs
    echo ""
    
    echo "✅ 배포 모니터링 완료 시간: $(date)"
}

# 스크립트 실행
main
