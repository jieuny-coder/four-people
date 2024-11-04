const express = require('express');
const router = express.Router();
const conn = require('../config/db');

// 로그인과 회원가입 요청을 받았을 때 처리해주는 곳 - 회원가입
router.post('/join', (req, res) => {
    console.log('회원가입 요청');
    console.log(req.body);

    // 포스트로 넘긴 데이터는 req안에 body로 존재한다.
    
    // db와 연결
    let { id, pw, name, email, phonenumber } = req.body; // name은 제거
    let sql = 'insert into member_tbl (id, pw, name, phonenumber, email) VALUES(?, ?, ?, ?, ?)';
    
    // 2번째 
    conn.query(sql,[id, pw, name, phonenumber, email],(err, rows) => {
        console.log("db insurt:",rows);
        if(rows){
            res.send({ result: 'success' });
        }else{
            res.send({ result: 'failed' });
        }
        
       
    });
});

// 로그인 부분
router.post('/U_login', (req, res) => {
    console.log('로그인 요청',req.body);
    let { id, pw } = req.body;
    let sql = 'SELECT * FROM USER WHERE user_id=? AND user_pw=?';

    conn.query(sql, [id, pw], (err, rows) => {
        console.log("db연결 결과 :",rows);
        if(rows){
            res.send({ result: 'success' });
        }else{
            res.send({ result: 'failed' });
        }
    });
});


// 회원정보 수정 부분
router.post('/UserMain',(req,res)=>{
    console.log('회원정보 수정요청',req.body);
    let { name,pw,car_number,phonenumber,email } = req.body;
    let sql = 'select * from member_tbl (name,pw,car_number,phonenumber,email) VALUES(?,?,?,?,?)';

    conn.query(sql,[name,pw,carnumber,phonenumber,eamil],(err,rows)=>{
        console.log("db연결 결과 :",rows);
        if(rows){
            res.send({ result: 'success' });
        }else{
            res.send({ result: 'failed' });
        }
    })

});

module.exports = router;
