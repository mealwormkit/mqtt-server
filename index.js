const express = require('express');
const path = require('path');
const cameraRoutes = require('./routes/camera');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ✅ CORS 허용 (앱에서 API 접근 가능)
app.use(cors());
app.use(express.json());

// ✅ MQTT 연결 (Docker 내부 Mosquitto 브로커 연결)
const mqttClient = mqtt.connect('mqtt://localhost'); // 또는 'mqtt://mqtt' (docker-compose 시)
mqttClient.on('connect', () => {
  console.log('✅ MQTT 브로커 연결 성공');
  mqttClient.subscribe('window/#'); // 필요시 토픽 설정
});
mqttClient.on('message', (topic, message) => {
  console.log(`📩 ${topic} → ${message.toString()}`);
});

// ✅ 정적 이미지 경로 설정 (브라우저에서 이미지 접근 가능)
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// ✅ /upload 및 /images/list 엔드포인트 등록
app.use('/', cameraRoutes);

// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT} ✅`);
});
