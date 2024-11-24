const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'project-db-stu3.smhrd.com', // 또는 'project-db-stu3.smhrd.com' 선택
    user: 'Insa5_JSB_final_1',
    password: 'aischool1',
    port: '3307',
    database: 'Insa5_JSB_final_1',
    waitForConnections: true,
    connectionLimit: 10, // 동시 연결 수
    queueLimit: 0, // 대기열 제한 없음
    connectTimeout: 10000, // 연결 타임아웃 10초
    acquireTimeout: 20000, // 풀에서 연결 가져오기 타임아웃 20초
    timeout: 30000 // 쿼리 실행 타임아웃 30초
});


// Pool 내보내기
module.exports = pool;



// conn.connect(err => {
//     if (err) {
//         console.error('DB 연결 오류:', err);
//         return;
//     }
//     console.log('DB에 성공적으로 연결되었습니다.');
// });

// module.exports = conn;
