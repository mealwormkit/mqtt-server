const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 📦 multer 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ 업로드 API
router.post('/upload', upload.single('image'), (req, res) => {
  console.log('📷 이미지 업로드됨:', req.file.filename);
  res.send({
    message: '이미지 업로드 성공',
    filename: req.file.filename,
    url: `/images/${req.file.filename}`,
  });
});

// ✅ 이미지 리스트 API
router.get('/images/list', (req, res) => {
  const dir = path.join(__dirname, '../uploads');
  console.log('✅ [/images/list] 요청 수신');

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('❌ 업로드 폴더 읽기 오류:', err);
      return res.status(500).json({ error: '파일 목록을 읽을 수 없습니다.' });
    }

    const images = files
      .filter(name => path.extname(name)) // 확장자 있는 파일만 필터링
      .map(name => ({
        filename: name,
        url: `/images/${name}`,
      }));

    res.json(images);
  });
});

router.get('/images/list', (req, res) => {
  console.log('✅ [/images/list] 요청 수신');
  ...
});


module.exports = router; // 📌 반드시 맨 아래
