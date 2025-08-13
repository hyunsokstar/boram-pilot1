module.exports = {
    apps: [{
        name: 'boram-pilot1',
        cwd: __dirname,
        script: 'npm',
        args: 'start',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production',
            PORT: 3000,
            // NextAuth base URLs (prod)
            NEXTAUTH_URL: 'http://3.36.184.159:3000',
            NEXTAUTH_URL_INTERNAL: 'http://localhost:3000',
            AUTH_URL: 'http://3.36.184.159:3000',
            // Backend origin for Next.js proxy rewrites
            BACKEND_URL: 'http://43.200.234.52:8080'
        },
        env_development: {
            NODE_ENV: 'development',
            PORT: 3000
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_file: './logs/combined.log',
        time: true,
        // 로그 로테이션 설정
        log_date_format: 'YYYY-MM-DD HH:mm Z',
        // 자동 재시작 설정
        min_uptime: '10s',
        max_restarts: 10,
        // 메모리 모니터링
        kill_timeout: 5000
    }]
};
