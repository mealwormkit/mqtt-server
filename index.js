const express = require('express');
const path = require('path');
const cameraRoutes = require('./routes/camera');
const mqtt = require('mqtt');           // ✅ mqtt 모듈 불러오기
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ MQTT 클라이언트 선언
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

mqttClient.on('connect', () => {
  console.log('✅ MQTT 브로커 연결 성공');
  mqttClient.subscribe('sensor/temperature');
});



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
