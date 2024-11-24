require("dotenv").config(); // 환경변수 로드
const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Connection Pool 가져오기

// 사용자 회원가입
router.post("/join", async (req, res) => {
  console.log("회원가입 요청:", req.body);

  const { id, pw, name, phone, email, carNumber, adminCode } = req.body;
  const query = adminCode
    ? `
      INSERT INTO ADMIN (admin_id, admin_pw, admin_email, admin_joined, admin_name, admin_phone, admin_auth_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    : `
      INSERT INTO USER (user_id, user_pw, user_email, car_number, user_joined, user_name, user_phone, handicap)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const params = adminCode
    ? [id, pw, email, new Date(), name, phone, adminCode]
    : [id, pw, email, carNumber, new Date(), name, phone, 1];

  try {
    const [results] = await pool.query(query, params);
    console.log("회원가입 성공:", results);
    res.status(201).json({ message: "회원가입 성공" });
  } catch (err) {
    console.error("회원가입 에러:", err);
    res.status(500).json({ error: "서버 에러", details: err.message });
  }
});

// 사용자 로그인
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "아이디와 비밀번호를 입력해주세요." });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM USER WHERE user_id = ?", [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "아이디 또는 비밀번호가 일치하지 않습니다." });
    }

    const user = rows[0];
    if (password !== user.user_pw) {
      return res.status(401).json({ error: "아이디 또는 비밀번호가 일치하지 않습니다." });
    }

    res.status(200).json({ message: "로그인 성공", user });
  } catch (err) {
    console.error("로그인 에러:", err);
    res.status(500).json({ error: "서버 에러", details: err.message });
  }
});

// 사용자 정보 조회
router.get("/userinfo", async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: "사용자 ID가 필요합니다." });
  }

  try {
    const [rows] = await pool.query("SELECT user_name, car_number FROM USER WHERE user_id = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("DB 조회 실패:", err);
    res.status(500).json({ error: "DB 오류", details: err.message });
  }
});

// 사용자 정보 수정
router.post("/update", async (req, res) => {
  const { user_id, name, phone, email, carNumber, currentPassword, newPassword } = req.body;

  if (!user_id || !currentPassword) {
    return res.status(400).json({ error: "사용자 ID와 현재 비밀번호가 필요합니다." });
  }

  try {
    const [rows] = await pool.query("SELECT user_pw FROM USER WHERE user_id = ?", [user_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    const storedPassword = rows[0].user_pw;
    if (currentPassword !== storedPassword) {
      return res.status(401).json({ error: "현재 비밀번호가 일치하지 않습니다." });
    }

    const updateQuery = `
      UPDATE USER SET user_name = ?, user_phone = ?, user_email = ?, car_number = ?
      ${newPassword ? ", user_pw = ?" : ""}
      WHERE user_id = ?
    `;
    const params = newPassword
      ? [name, phone, email, carNumber, newPassword, user_id]
      : [name, phone, email, carNumber, user_id];

    await pool.query(updateQuery, params);
    res.status(200).json({ message: "회원정보가 수정되었습니다." });
  } catch (err) {
    console.error("회원정보 수정 에러:", err);
    res.status(500).json({ error: "DB 오류", details: err.message });
  }
});

// 차량 번호로 사용자 정보 조회
router.get("/search-by-car-number", async (req, res) => {
  const { carNumber } = req.query;

  if (!carNumber) {
    return res.status(400).json({ error: "차량 번호를 입력해주세요." });
  }

  try {
    const [rows] = await pool.query(`
      SELECT user_joined, car_number, user_name, user_phone, handicap
      FROM USER WHERE car_number = ?
    `, [carNumber]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "해당 차량 번호로 사용자를 찾을 수 없습니다." });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("차량 번호 조회 실패:", err);
    res.status(500).json({ error: "서버 에러", details: err.message });
  }
});

module.exports = router;
