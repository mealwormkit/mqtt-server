FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# Node.js 의존성 설치
COPY package*.json ./
RUN npm install

# 나머지 앱 파일 복사
COPY . .

# 포트 노출 (HTTP 서버용)
EXPOSE 3000

# Node.js 서버 실행
CMD ["node", "index.js"]
