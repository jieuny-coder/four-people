const express = require('express');
const router = express.Router();

// 기본 라우트 설정
router.get('/', (req, res) => {
  res.send("Hello from the main route!");
});

module.exports = router;

