FROM node:18

RUN apt-get update && \
    apt-get install -y mosquitto && \
    apt-get clean

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# 모스키토 설정 명확하게 복사
COPY mosquitto.conf /etc/mosquitto/mosquitto.conf

# 포트 노출
EXPOSE 3000
EXPOSE 9001

# 모스키토가 먼저 실행되도록 대기 시간 추가
CMD ["sh", "-c", "mosquitto -c /etc/mosquitto/mosquitto.conf & sleep 3 && node index.js"]
