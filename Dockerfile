# 1단계: 빌드 스테이지 (멀티 스테이지 빌드)
FROM node:20-alpine AS builder

# pnpm 설치
RUN npm install -g pnpm

# 최상위 폴더를 작업 디렉토리
WORKDIR /app

# 공통 package.json과 lock 파일을 복사 및 설치
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod  # --prod로 프로덕션 의존성만 설치

# 프론트엔드 파일 복사 및 빌드
WORKDIR /app/apps/frontend
COPY apps/frontend ./
RUN pnpm install --prod
RUN pnpm run build

# 백엔드 파일 복사 및 의존성 설치
WORKDIR /app/apps/backend
COPY apps/backend ./
RUN pnpm install --prod

# 2단계: 실제 실행 이미지
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 빌드 스테이지에서 필요한 파일만 복사
COPY --from=builder /app/apps/frontend/dist /app/apps/frontend/dist
COPY --from=builder /app/apps/backend/dist /app/apps/backend/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml

# 불필요한 의존성 및 파일 복사하지 않기 (예: node_modules)
# 실행 환경에서 pnpm을 전역 설치하지 않음

# 프론트엔드와 백엔드 포트 노출 설정
EXPOSE 3000 8080

# 컨테이너 시작 시 실행
CMD ["sh", "-c", "pnpm --prefix /app/apps/frontend run dev & pnpm --prefix /app/apps/backend start"]
