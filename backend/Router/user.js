const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // 비밀번호 암호화 비교를 위해 필요
const conn = require('../config/db');

// 사용자 회원가입
router.post('/join', async (req, res) => {
    console.log('회원가입 요청');
    console.log('요청데이터 출력:', req.body);

    const { id, pw, name, phone, email,carNumber, adminCode } = req.body; // id와 pw 사용
    const username = id; // id를 username에 할당
    const password = pw; // pw를 password에 할당

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 비밀번호 해시화

        const userQuery = `INSERT INTO USER (user_id, user_pw, user_email, car_number, user_joined, user_name, user_phone, handicap) VALUES (?, ?, ?, ?, ?, ?, ? ,?)`;
        const adminQuery = `INSERT INTO ADMIN (admin_id, admin_pw, admin_email, admin_joined, admin_name, admin_phone) VALUES (?, ?, ?, ?, ?, ?)`;

        const query = adminCode ? adminQuery : userQuery;
        const params = adminCode 
            ? [username, hashedPassword, email, new Date(), name, phone]
            : [username, hashedPassword, email, carNumber, new Date(), name, phone, 0];

        // 실행할 쿼리와 파라미터를 로그로 출력
        console.log('Executing query:', query);
        console.log('With params:', params);

        conn.query(query, params, (err, results) => {
            if (err) {
                console.error('회원가입 에러:', err);
                res.status(500).json({ error: '서버 에러' });
            } else {
                console.log('회원가입 성공:', results);
                res.status(201).json({ message: '회원가입 성공' });
            }
        });
    } catch (error) {
        console.error('회원가입 에러:', error);
        res.status(500).json({ error: '서버 에러' });
    }
});





// 사용자 로그인
router.post('/login', (req, res) => {
    console.log('서버에서 로그인 요청 수신:', req.body);

    const { username, password } = req.body; // 클라이언트에서 받은 데이터
    const query = `SELECT * FROM USER WHERE user_id = ?`;

    conn.query(query, [username], (err, results) => {
        if (err) {
            console.error('로그인 에러:', err);
            res.status(500).json({ error: '서버 에러' });
        } else if (results.length > 0) {
            const user = results[0];

            // 비밀번호 비교
            bcrypt.compare(password, user.user_pw, (err, isPasswordValid) => {
                if (err) {
                    console.error('비밀번호 비교 중 에러:', err);
                    res.status(500).json({ error: '서버 에러' });
                } else if (isPasswordValid) {
                    console.log('로그인 성공!');
                    res.json({ message: '로그인 성공', user });
                } else {
                    console.log('비밀번호 불일치');
                    res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
                }
            });
        } else {
            console.log('사용자 정보 없음');
            res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }
    });
});





// 관리자 로그인
router.post('/admin-login', (req, res) => {
    console.log('관리자 로그인 요청 수신:', req.body);

    const { username, password } = req.body; // 클라이언트에서 받은 데이터
    const query = `SELECT * FROM ADMIN WHERE admin_id = ?`;

    conn.query(query, [username], (err, results) => {
        if (err) {
            console.error('관리자 로그인 에러:', err);
            res.status(500).json({ error: '서버 에러' });
        } else if (results.length > 0) {
            const admin = results[0];

            // 비밀번호 비교
            bcrypt.compare(password, admin.admin_pw, (err, isPasswordValid) => {
                if (err) {
                    console.error('비밀번호 비교 중 에러:', err);
                    res.status(500).json({ error: '서버 에러' });
                } else if (isPasswordValid) {
                    console.log('관리자 로그인 성공!');
                    res.json({ message: '관리자 로그인 성공', admin });
                } else {
                    console.log('비밀번호 불일치');
                    res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
                }
            });
        } else {
            console.log('관리자 정보 없음');
            res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }
    });
});


module.exports = router;
