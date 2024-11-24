const serverless = require("serverless-http");
const app = require("./server"); // server.js의 Express 앱 가져오기

// Lambda 핸들러 내보내기
module.exports.handler = serverless(app);

// 로컬 환경에서 실행 (app.listen 유지)
if (process.env.NODE_ENV !== "production") {
  const port = 4000;
  app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });
}







// const express = require("express");
// const app = express();
// const port = 4000;

// // 기본 라우트 설정
// app.get("/", (req, res) => {
//   res.send("Hello from the backend server!");
// });

// // 서버 실행
// app.listen(port, () => {
//   console.log(`Backend server is running on http://localhost:${port}`);
// });
