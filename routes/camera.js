const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + ext;
    cb(null, name);
  }
});

const upload = multer({ storage });

// 이미지 업로드 API
router.post('/upload', upload.single('image'), (req, res) => {
  console.log('📷 이미지 업로드됨:', req.file);
  res.send({
    message: '이미지 업로드 성공',
    filename: req.file.filename,
    url: `/images/${req.file.filename}`
  });
});

// 이미지 목록 API
router.get('/images/list', (req, res) => {
  const dir = path.join(__dirname, '../uploads');

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('❌ 업로드 폴더 읽기 오류:', err);
      return res.status(500).json({ error: '파일 목록을 읽을 수 없습니다.' });
    }

    const images = files
      .filter(name => path.extname(name)) // 확장자 필터
      .map(name => ({
        filename: name,
        url: `/images/${name}`
      }));

    res.json(images);
  });
});

module.exports = router; // ✅ 반드시 마지막 줄
