const express = require('express');
const path = require('path');
const cameraRoutes = require('./routes/camera');
const cors = require('cors');
const mqtt = require('mqtt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

// 👉 여기에 추가
app.get('/api/status', (req, res) => {
  res.json({
    temperature: 24.2,
    humidity: 55,
    motion: '감지안됨',
    window: '닫힘'
  });
});

app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use('/', cameraRoutes);

app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
