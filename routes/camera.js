const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// ✅ 올바른 multer 저장 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);     // 확장자 유지 (.jpg 등)
    const name = Date.now() + ext;                   // 예: 1727908461263.jpg
    cb(null, name);
  }
});

const upload = multer({ storage });  // ⬅ 이 부분 중요! dest: 'uploads/' 아님

router.post('/upload', upload.single('image'), (req, res) => {
  console.log('📷 이미지 업로드됨:', req.file);
  res.send({
    message: '이미지 업로드 성공',
    filename: req.file.filename,
    url: `/images/${req.file.filename}`
  });
});

module.exports = router;

const fs = require('fs');

// 📂 업로드된 파일 리스트 반환
router.get('/images/list', (req, res) => {
  const dir = path.join(__dirname, '../uploads');

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('❌ 업로드 폴더 읽기 오류:', err);
      return res.status(500).json({ error: '파일 목록을 읽을 수 없습니다.' });
    }

    // 확장자 있는 파일만 필터링 (이미지 파일만)
    const images = files
      .filter(name => path.extname(name))
      .map(name => ({
        filename: name,
        url: `/images/${name}`
      }));

    res.json(images);
  });
});

