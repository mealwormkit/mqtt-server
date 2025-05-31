const express = require('express');
const mqtt = require('mqtt');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let latestData = {};

const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');
mqttClient.on('connect', () => {
  console.log('MQTT connected');
  mqttClient.subscribe('window/#');
});
mqttClient.on('message', (topic, message) => {
  try {
    latestData[topic] = JSON.parse(message.toString());
  } catch {
    latestData[topic] = message.toString();
  }
});

app.get('/api/sensors', (req, res) => {
  res.json(latestData);
});

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `photo_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });
app.post('/upload', upload.single('image'), (req, res) => {
  res.json({ file: req.file.filename });
});

app.use('/images', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});