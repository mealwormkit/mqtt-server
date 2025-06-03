const express = require('express');
const path = require('path');
const cameraRoutes = require('./routes/camera');
const mqtt = require('mqtt');
const cors = require('cors');
// const { Server } = require('socket.io'); // 실시간 전송용 (옵션)

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ MQTT 브로커 연결
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

mqttClient.on('connect', () => {
  console.log('✅ MQTT 브로커 연결 성공');
  mqttClient.subscribe('sensor/temperature'); // 예시 토픽
});

mqttClient.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log(`🌡 Temperature: ${data.temp}°C, 💧 Humidity: ${data.humidity}%`);

    // ▶ 여기에 웹 대시보드로 실시간 전송하는 코드 삽입 가능 (예: socket.io)
    // io.emit('sensorData', {
    //   temperature: data.temp,
    //   humidity: data.humidity,
    // });

  } catch (err) {
    console.error('❌ JSON 파싱 실패:', message.toString());
  }
});

// ✅ 이미지 업로드된 경로를 정적 경로로 공개
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// ✅ 업로드, 리스트 라우터 연결
app.use('/', cameraRoutes);

// ✅ 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
