const express = require("express");
const router = express.Router();
const conn = require("../config/db"); // DB 연결 객체 가져오기

// 사용자 회원가입
router.post("/join", (req, res) => {
  console.log("회원가입 요청");
  console.log("요청데이터 출력:", req.body);

  const { id, pw, name, phone, email, carNumber, adminCode } = req.body;
  const username = id;
  const password = pw;

  const userQuery = `
    INSERT INTO USER (user_id, user_pw, user_email, car_number, user_joined, user_name, user_phone, handicap)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const adminQuery = `
    INSERT INTO ADMIN (admin_id, admin_pw, admin_email, admin_joined, admin_name, admin_phone, admin_auth_code)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const query = adminCode ? adminQuery : userQuery;
  const params = adminCode
    ? [id, password, email, new Date(), name, phone, adminCode]
    : [id, password, email, carNumber, new Date(), name, phone, 1];

  conn.query(query, params, (err, results) => {
    if (err) {
      console.error("회원가입 에러:", err);
      res.status(500).json({ error: "서버 에러" });
    } else {
      res.status(201).json({ message: "회원가입 성공" });
    }
  });
});

// 사용자 로그인
router.post("/login", (req, res) => {
  console.log("서버에서 로그인 요청 수신:", req.body);

  const { username, password } = req.body;
  const query = `SELECT * FROM USER WHERE user_id = ?`;

  conn.query(query, [username], (err, results) => {
    if (err) {
      console.error("로그인 에러:", err);
      res.status(500).json({ error: "서버 에러" });
    } else if (results.length > 0) {
      const user = results[0];
      if (password === user.user_pw) {
        res.json({ message: "로그인 성공", user });
      } else {
        res.status(401).json({ error: "아이디 또는 비밀번호가 일치하지 않습니다." });
      }
    } else {
      res.status(401).json({ error: "아이디 또는 비밀번호가 일치하지 않습니다." });
    }
  });
});

// 사용자 정보 조회
router.get("/userinfo", (req, res) => {
  const userId = req.query.user_id; // 쿼리 파라미터에서 user_id 전달받기
  if (!userId) {
    return res.status(400).json({ error: "사용자 ID가 필요합니다." });
  }

  const query = "SELECT user_name, car_number FROM USER WHERE user_id = ?";
  conn.query(query, [userId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "DB 오류" });
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }
  });
});

// 사용자 정보 수정
router.post("/update", (req, res) => {
  const { user_id, name, phone, email, carNumber, currentPassword, newPassword } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "사용자 ID가 필요합니다." });
  }

  // 현재 비밀번호 확인
  const query = "SELECT user_pw FROM USER WHERE user_id = ?";
  conn.query(query, [user_id], (error, results) => {
    if (error) {
      console.error("DB 오류:", error);
      return res.status(500).json({ error: "DB 오류" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    const storedPassword = results[0].user_pw;
    if (currentPassword !== storedPassword) {
      return res.status(401).json({ error: "현재 비밀번호가 일치하지 않습니다." });
    }

    const updateUser = (newPassword) => {
      const sql = `
        UPDATE USER
        SET user_name = ?, user_phone = ?, user_email = ?, car_number = ?
        ${newPassword ? ", user_pw = ?" : ""}
        WHERE user_id = ?
      `;
      const params = newPassword
        ? [name, phone, email, carNumber, newPassword, user_id]
        : [name, phone, email, carNumber, user_id];

      conn.query(sql, params, (error, results) => {
        if (error) {
          console.error("회원정보 수정 중 오류:", error);
          return res.status(500).json({ error: "DB 오류" });
        }
        res.json({ message: "회원정보가 수정되었습니다." });
      });
    };

    updateUser(newPassword || null);
  });
});

// 차량 번호로 사용자 정보 조회
router.get("/search-by-car-number", (req, res) => {
  const { carNumber } = req.query;

  if (!carNumber) {
    return res.status(400).json({ error: "차량 번호를 입력해주세요." });
  }

  const sql = `
    SELECT user_joined, car_number, user_name, user_phone, handicap
    FROM USER
    WHERE car_number = ?
  `;
  conn.query(sql, [carNumber], (err, results) => {
    if (err) {
      console.error("차량 번호 조회 중 오류:", err);
      return res.status(500).json({ error: "서버 에러" });
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ error: "해당 차량 번호로 사용자를 찾을 수 없습니다." });
    }
  });
});

module.exports = router;
