const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const aedes = require('aedes')();
const net = require('net');

const app = express();
const port = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────────
// MQTT 브로커 실행 (ESP32용)
const mqttPort = 1883;
const server = net.createServer(aedes.handle);
server.listen(mqttPort, () => {
  console.log('📡 MQTT 브로커 실행 중:', mqttPort);
});

// ─────────────────────────────────────────────────────────────
// 미들웨어
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// ─────────────────────────────────────────────────────────────
// 업로드 설정
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ─────────────────────────────────────────────────────────────
// 센서 상태 저장소 (메모리 기반)
let latestSensorData = {
  temperature: '--',
  humidity: '--',
  motion: '없음',
  window: '닫힘'
};

// ─────────────────────────────────────────────────────────────
// MQTT 메시지 수신 처리
aedes.on('client', client => {
  console.log(`📥 MQTT 클라이언트 연결됨: ${client.id}`);
});

aedes.on('publish', (packet, client) => {
  if (packet.topic === 'mykmou/window25/sensor') {
    try {
      const data = JSON.parse(packet.payload.toString());
      latestSensorData = { ...latestSensorData, ...data };
      console.log('📊 센서 데이터 업데이트:', latestSensorData);
    } catch (err) {
      console.error('❌ 센서 데이터 파싱 실패:', err);
    }
  }
});

// ─────────────────────────────────────────────────────────────
// API 엔드포인트들
app.get('/api/status', (req, res) => {
  res.json(latestSensorData);
});

app.post('/api/control', (req, res) => {
  const { action } = req.body;
  console.log('🛠 제어 명령 수신:', action);
  aedes.publish({
    topic: 'mykmou/window25/control',
    payload: JSON.stringify({ action })
  });
  res.json({ status: '명령 전송됨', action });
});

app.post('/upload', upload.single('image'), (req, res) => {
  res.json({
    filename: req.file.filename,
    url: `/images/${req.file.filename}`
  });
});

app.get('/images/list', (req, res) => {
  const files = fs.readdirSync('./uploads');
  const list = files.map(filename => ({
    filename,
    url: `/images/${filename}`
  }));
  res.json(list);
});

// ─────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`🚀 HTTP 서버 실행 중: http://localhost:${port}`);
});
