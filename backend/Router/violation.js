const express = require('express');
const router = express.Router();
const conn = require('../config/db');
const app = express();

// 회원의 위반 차량 정보 가져오기
app.get('/user/violations/:id',(req,res)=>{
    console.log('id에 접근',req.body);

    let { id } = req.body;
    let sql = 'SELECT * FROM violations WHERE user_id = ?';

    conn.query(sql,[id],(err,rows)=>{
        console.log('id접근완료');
        if(rows){
            res.send({ result: 'success' });
        }else{
            res.send({ result: 'failed' });
        }
    })

})