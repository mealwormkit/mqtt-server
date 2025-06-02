const express = require('express');
const path = require('path');
const cameraRoutes = require('./routes/camera');
const mqtt = require('mqtt');

const app = express();

// MQTT 연결 예시
const mqttClient = mqtt.connect('mqtt://mqtt'); // Docker 내부용
mqttClient.on('connect', () => {
  console.log('✅ MQTT 브로커 연결 성공');
});

// ✅ 업로드된 파일을 정적 URL로 접근할 수 있게 설정
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// 📸 /upload 엔드포인트 연결
app.use('/', cameraRoutes);

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
