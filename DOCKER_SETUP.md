# 🐳 Docker 설정 가이드

## 필수 요구사항

- Docker Desktop 설치
- Docker Compose 설치
- PostgreSQL 클라이언트 (psql)

## 🚀 빠른 시작

### 1. Docker Desktop 설치 확인

```bash
docker --version
docker-compose --version
```

### 2. 프로젝트 실행

```bash
# Docker 컨테이너와 함께 전체 프로젝트 시작
./start.sh

# 또는 Docker만 먼저 시작
docker-compose up -d

# 그 다음 애플리케이션 시작
./dev.sh
```

## 📦 Docker 서비스

프로젝트는 다음 Docker 서비스를 사용합니다:

### PostgreSQL (포트 5432)
- 사용자: `postgres`
- 비밀번호: `postgres`
- 데이터베이스: `infographai_dev`
- 연결 문자열: `postgresql://postgres:postgres@localhost:5432/infographai_dev`

### Redis (포트 6379)
- 캐싱 및 세션 관리용
- 연결 문자열: `redis://localhost:6379`

### LocalStack (포트 4566) - 선택사항
- AWS S3 로컬 에뮬레이션
- CloudWatch 로컬 에뮬레이션

## 🔧 Docker 명령어

### 컨테이너 시작
```bash
# 모든 서비스 시작
docker-compose up -d

# 특정 서비스만 시작
docker-compose up -d postgres redis
```

### 컨테이너 상태 확인
```bash
docker-compose ps
```

### 로그 확인
```bash
# 모든 서비스 로그
docker-compose logs

# 특정 서비스 로그
docker-compose logs postgres
docker-compose logs -f postgres  # 실시간 로그
```

### 컨테이너 종료
```bash
# 종료만 (데이터 유지)
docker-compose stop

# 종료 및 제거 (데이터 유지)
docker-compose down

# 완전 초기화 (데이터 삭제)
docker-compose down -v
```

## 🗄️ 데이터베이스 접속

### psql로 직접 접속
```bash
PGPASSWORD=postgres psql -h localhost -U postgres -d infographai_dev
```

### 데이터베이스 초기화 (필요시)
```bash
# Prisma 마이그레이션 실행
cd apps/api
npx prisma migrate dev
npx prisma db seed  # 시드 데이터 생성
```

## ❗ 문제 해결

### 1. Docker Desktop이 실행되지 않음
```bash
# macOS
open -a Docker

# 또는 Docker Desktop 앱을 직접 실행
```

### 2. 포트 충돌
```bash
# 5432 포트 사용 중인 프로세스 확인
lsof -i :5432

# 기존 PostgreSQL 종료 (macOS)
brew services stop postgresql
```

### 3. 컨테이너 재시작
```bash
docker-compose restart postgres
docker-compose restart redis
```

### 4. 데이터베이스 연결 실패
```bash
# 컨테이너 상태 확인
docker-compose ps

# 컨테이너 로그 확인
docker-compose logs postgres

# 컨테이너 재생성
docker-compose down
docker-compose up -d
```

## 📝 환경 변수 설정

`.env.local` 파일에 다음 설정이 있어야 합니다:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/infographai_dev"

# Redis
REDIS_URL="redis://localhost:6379"
```

## 🔍 Docker 없이 로컬 실행 (대체 방법)

Docker를 사용하지 않으려면:

### PostgreSQL 로컬 설치
```bash
# macOS
brew install postgresql
brew services start postgresql
createdb infographai_dev

# 사용자 및 비밀번호 설정
psql -d infographai_dev
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE infographai_dev TO postgres;
```

### Redis 로컬 설치
```bash
# macOS
brew install redis
brew services start redis
```

그 후 `.env.local` 파일의 연결 정보를 로컬 설정에 맞게 수정하세요.