require("dotenv").config(); // 환경변수 로드
const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Connection Pool 가져오기
const moment = require("moment-timezone"); // 시간 관리 모듈

// 주차장 찾기에서 얻은 위도, 경도 데이터를 DB에 저장하기
router.post("/parkinglist", async (req, res) => {
  const { latitude, longitude } = req.body;
  console.log("받은 데이터:", { latitude, longitude });

  // 한국 시간으로 현재 시간 생성
  const currentTime = moment.tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");

  const query = "INSERT INTO maplist (latitude, longitude, time) VALUES (?, ?, ?)";
  try {
    const [results] = await pool.query(query, [latitude, longitude, currentTime]);
    console.log("DB 저장 성공:", results);
    res.status(200).json({ message: "데이터 전송 성공!", results });
  } catch (err) {
    console.error("DB 저장 실패:", err);
    res.status(500).json({ error: "DB 저장 실패", details: err.message });
  }
});

// 데이터 삭제 API (CloudWatch Event와 통합)
router.post("/delete-old-data", async (req, res) => {
  const deleteQuery = `
    DELETE m
    FROM maplist m
    JOIN (
      SELECT time
      FROM maplist
      ORDER BY time ASC
      LIMIT 1
    ) subquery
    ON m.time = subquery.time;
  `;
  try {
    const [results] = await pool.query(deleteQuery);
    console.log("자동 데이터 삭제 성공:", results);
    res.status(200).json({ message: "데이터 삭제 성공", results });
  } catch (err) {
    console.error("데이터 삭제 실패:", err);
    res.status(500).json({ error: "데이터 삭제 실패", details: err.message });
  }
});

// Kakao API - DB에서 위도/경도 데이터 가져오기
router.get("/parkinglist2", async (req, res) => {
  const sql = `
    SELECT latitude, longitude
    FROM maplist
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
  `;
  try {
    const [results] = await pool.query(sql);
    if (results.length === 0) {
      return res.status(404).json({ message: "DB에 데이터가 없습니다." });
    }

    const coordinates = results.map((item) => ({
      latitude: item.latitude,
      longitude: item.longitude,
    }));

    console.log("Coordinates:", coordinates);
    res.status(200).json({ coordinates });
  } catch (err) {
    console.error("DB 조회 실패:", err);
    res.status(500).json({ error: "DB 조회 실패", details: err.message });
  }
});

// Kakao API - 로드뷰 설정
router.get("/parkinglist3", async (req, res) => {
  const sql = `
    SELECT latitude, longitude
    FROM maplist
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
  `;
  try {
    const [results] = await pool.query(sql);
    if (results.length === 0) {
      return res.status(404).json({ message: "DB에 데이터가 없습니다." });
    }

    const coordinates = results.map((item) => ({
      latitude: item.latitude,
      longitude: item.longitude,
    }));

    console.log("Coordinates:", coordinates);
    res.status(200).json({ coordinates });
  } catch (err) {
    console.error("DB 조회 실패:", err);
    res.status(500).json({ error: "DB 조회 실패", details: err.message });
  }
});

module.exports = router;
