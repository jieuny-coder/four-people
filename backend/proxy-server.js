const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); // 모든 출처 허용

// 프록시 라우트
app.get('/download', async (req, res) => {
  const fileUrl = req.query.url; // 클라이언트가 전달한 URL
  console.log('Proxy server - downloading file from:', fileUrl);

  if (!fileUrl) {
    return res.status(400).send('URL이 필요합니다.');
  }

  try {
    // 외부 파일 요청
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });

    // 파일 응답 헤더 설정
    res.setHeader('Content-Disposition', 'attachment; filename=video.mp4');
    res.setHeader('Content-Type', 'video/mp4');
    res.send(response.data); // 파일 데이터 전송
  } catch (error) {
    console.error('프록시 서버 오류:', error.message);
    res.status(500).send('파일 다운로드 중 오류가 발생했습니다.');
  }
});

// 프록시 서버 실행
// const PORT = 4001;
// app.listen(PORT, () => {
//   console.log(`프록시 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
// });


// Express 앱 내보내기 (AWS Lambda 핸들러에서 사용할 수 있도록)
module.exports = app;