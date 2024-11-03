const express = require('express');
const app = express();
const user = require('./Router/user');
const main = require('./Router/main');
const cors = require('cors');

// CORS 미들웨어를 먼저 설정
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json()); // JSON 파싱 미들웨어 설정

// 라우터 설정
app.use('/user', user);
app.use('/', main);

app.set('port', process.env.PORT || 4000)
app.listen(app.get('port'), ()=>{
    console.log(`Server is running on ${app.get('port')}`);
    
})
