const express = require('express');
const path = require('path');
const cameraRoutes = require('./routes/camera');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS 허용 (앱에서 접근 시 필요)
app.use(cors());
app.use(express.json());

// ✅ MQTT 연결 (Docker 내부 MQTT 브로커)
const mqttClient = mqtt.connect('mqtt://mqtt');
mqttClient.on('connect', () => {
  console.log('✅ MQTT 브로커 연결 성공');
  mqttClient.subscribe('window/#'); // 추가해도 무방
});
mqttClient.on('message', (topic, message) => {
  console.log(`📩 ${topic} → ${message.toString()}`);
});

// ✅ 이미지 접근 경로 설정
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// ✅ 라우터 연결 (/upload, /images/list 포함)
app.use('/', cameraRoutes);

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
