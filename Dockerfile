FROM node:18

# Mosquitto 설치
RUN apt-get update && \
    apt-get install -y mosquitto && \
    apt-get clean

# 앱 디렉토리 설정
WORKDIR /app

# Node.js 파일 복사
COPY package*.json ./
RUN npm install
COPY . .

# Mosquitto 설정 복사
COPY mosquitto.conf /etc/mosquitto/mosquitto.conf

# 포트 오픈
EXPOSE 3000 1883 9001

# 서버와 모스키토 동시 실행
CMD ["sh", "-c", "mosquitto -c /etc/mosquitto/mosquitto.conf & sleep 1 && node index.js"]
