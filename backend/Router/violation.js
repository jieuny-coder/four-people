const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Connection Pool 가져오기

// 공통 SQL 실행 함수
async function executeQuery(sql, params, res, successMessage = "Success") {
  try {
    const [rows] = await pool.query(sql, params);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No data found." });
    }
    res.status(200).json({ message: successMessage, data: rows });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Database query failed.", details: err.message });
  }
}

// 날짜, 차량번호, 시간 범위를 기준으로 위반 데이터 필터링
router.get("/filter_violations", async (req, res) => {
  const { car_number, startTime, endTime } = req.query;

  if (!car_number || !startTime || !endTime) {
    return res.status(400).json({ error: "차량 번호, 시작 시간, 종료 시간을 모두 제공해주세요." });
  }

  const sql = `
    SELECT * 
    FROM VIOLATION 
    WHERE upload_time BETWEEN ? AND ? 
      AND violation_number = ?
  `;

  await executeQuery(sql, [startTime, endTime, car_number], res, "Violation data retrieved.");
});

// 기간으로 위반 데이터 조회
router.get("/filtering_dateRange", async (req, res) => {
  const { startDate, endDate, car_number } = req.query;

  if (!startDate || !endDate || !car_number) {
    return res.status(400).json({ error: "차량 번호, 시작 날짜, 끝 날짜를 모두 제공해주세요." });
  }

  const sql = `
    SELECT * 
    FROM VIOLATION 
    WHERE upload_time BETWEEN ? AND ? 
      AND violation_number = ?
  `;
  const startDateTime = `${startDate} 00:00:00`;
  const endDateTime = `${endDate} 23:59:59`;

  await executeQuery(sql, [startDateTime, endDateTime, car_number], res, "Date range data retrieved.");
});

// 차량 위반 데이터 전체 조회
router.get("/all", async (req, res) => {
  const sql = "SELECT * FROM VIOLATION ORDER BY upload_time DESC";
  await executeQuery(sql, [], res, "All violation data retrieved.");
});

// 특정 차량 번호(+날짜/시간)의 동영상 데이터 반환
router.get("/videos", async (req, res) => {
  const { violationNumber, dateTime } = req.query;

  if (!violationNumber || !dateTime) {
    return res.status(400).json({ error: "violationNumber(차량 번호)와 dateTime(날짜+시간)이 필요합니다." });
  }

  const sql = `
    SELECT violation_id, violation_number, upload_time, url, filename
    FROM VIOLATION
    WHERE violation_number = ? AND upload_time = ?
    ORDER BY upload_time DESC
    LIMIT 1
  `;

  await executeQuery(sql, [violationNumber, dateTime], res, "Video data retrieved.");
});

// 적재물 위반 데이터 전체 조회
router.get("/obstacle_all", async (req, res) => {
  const sql = `
    SELECT * 
    FROM OBSTACLE_VIOLATION 
    ORDER BY DATE(detected_at) DESC, TIME(detected_at) DESC
  `;
  await executeQuery(sql, [], res, "All obstacle violation data retrieved.");
});

module.exports = router;
