FROM node:18

# Mosquitto 설치
RUN apt-get update && \
    apt-get install -y mosquitto && \
    apt-get clean

WORKDIR /app

# Node.js 설치
COPY package*.json ./
RUN npm install
COPY . .

# Mosquitto 설정 복사
COPY mosquitto.conf /etc/mosquitto/mosquitto.conf

# 포트 노출
EXPOSE 3000
EXPOSE 9001

# Mosquitto 실행 → Node.js 실행
CMD ["sh", "-c", "mosquitto -c /etc/mosquitto/mosquitto.conf & sleep 1 && node index.js"]
