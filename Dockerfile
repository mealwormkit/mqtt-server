# Node.js 베이스 이미지 사용
FROM node:18

# 컨테이너 안에서 사용할 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 나머지 소스 전체 복사
COPY . .

# 서버 실행 명령어
CMD ["node", "index.js"]
