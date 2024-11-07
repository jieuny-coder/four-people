const express = require('express');
const router = express.Router();
const conn = require('../config/db');


// 날짜, 차량번호, 시간 범위를 기준으로 위반 데이터 필터링
router.get('/filter_Violations',(req,res)=>{
    console.log('GET /filter_Violations route hit'); // 로그 추가

    const { car_number, startTime, endTime } = req.query;

    // SQL 쿼리 작성: violation_date와 violation_time을 결합하여 DateTime 형식으로 비교
    const sql = `SELECT * 
                 FROM VIOLATION 
                 WHERE CONCAT(violation_date, ' ', violation_time) BETWEEN ? AND ?
                 AND violation_number = ?`;

    // 쿼리 실행 전에 쿼리와 파라미터를 로그로 출력
    console.log('실행될 쿼리:', sql);
    console.log('쿼리 파라미터:', [startTime, endTime, car_number]);


    // 쿼리 실행
    conn.query(sql, [startTime, endTime, car_number], (err, rows) => {
        if (err) {
            console.error('위반데이터 fetching 에러 :', err);
            return res.status(500).json({ error: '위반데이터 fetching failed' });
        } else if (rows.length > 0) {
            return res.status(200).json(rows);
        } else {
            return res.status(200).json({ message: '데이터가 없습니다', data: [] });
        }
    });
});

module.exports = router;
