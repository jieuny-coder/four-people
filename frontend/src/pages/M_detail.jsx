import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const M_detail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date'); // 달력에서 선택한 날짜
  const startDate = queryParams.get('start'); // 조회 시작 날짜 (직접 설정된 시간)
  const endDate = queryParams.get('end'); // 조회 종료 날짜 (직접 설정된 시간)
  const carNumber = queryParams.get('carNumber'); // 차량 번호
  const selectedTime = queryParams.get('selectedTime'); // 조회 시간 (6시간, 12시간, 24시간)

  const [violations, setViolations] = useState([]); // 가져온 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태관리

  let startTimeDisplay = startDate;
  let endTimeDisplay = endDate;

  // 선택된 날짜를 기준으로 시작 시간과 종료 시간을 설정
  if (selectedTime) {
    const selectedDateTime = new Date(`${date} 23:59`); // 선택한 날짜의 끝 시간으로 설정
    const start = new Date(selectedDateTime);

    if (selectedTime === '6시간') {
      start.setHours(start.getHours() - 6);
    } else if (selectedTime === '12시간') {
      start.setHours(start.getHours() - 12);
    } else if (selectedTime === '24시간') {
      start.setHours(start.getHours() - 24);
    }

    // 날짜와 시간을 포함한 형식으로 변환 (YYYY-MM-DD HH:MM)
    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    startTimeDisplay = formatDateTime(start);
    endTimeDisplay = formatDateTime(selectedDateTime);
  }

  // API 호출을 위한 useEffect 추가
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/violation/filter_Violations', {
          params: {
            date: date, // 선택한 날짜
            car_number: carNumber, // 차량 번호
            startTime: startTimeDisplay, // HH:MM:SS 형식으로 변환
            endTime: endTimeDisplay // HH:MM:SS 형식으로 변환
          }
        });

        console.log('응답 데이터:', response.data); // 응답 데이터 확인
        setViolations(response.data); // 데이터 상태 저장
        setLoading(false); // 로딩 완료
      } catch (error) {
        console.error('위반데이터 패치 실패:', error);
        setLoading(false); // 로딩 실패시에도 완료로 설정
      }
    };

    // 필요한 파라미터가 있을 때만 API 호출
    if (date && carNumber && startTimeDisplay && endTimeDisplay) {
      fetchData();
    }
  }, [date, carNumber, startTimeDisplay, endTimeDisplay]); // 의존성 배열에 파라미터 추가

  // 로딩 중일 경우
  if (loading) return <p>Loading...</p>;

  return (
    <div className="m_detail-container-unique">
      {/* 필터링 조건 표시 - 테이블 형식 */}
      <div className="m_detail-filter-unique">
        <table className="filter-table">
          <tbody>
            <tr>
              <td>차량번호:</td>
              <td>{carNumber}</td>
            </tr>
            <tr>
              <td>선택된 날짜:</td>
              <td>{date}</td>
            </tr>
            <tr>
              <td>조회 기간:</td>
              <td>{startTimeDisplay} ~ {endTimeDisplay}<br/>({selectedTime})</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 사진 표시 영역 */}
      <div className="m_detail-photo-unique">
        <div className="m_detail-photo-box-unique">사진</div>
      </div>

      {/* 위반 내역을 표 형식으로 표시 */}
      <div className="m_detail-violation-unique">
        <table className="violation-table">
          <thead>
            <tr>
              <th>위반차량</th>
              <th>위반날짜</th>
              <th>위반시간</th>
              <th>위반장소</th>
            </tr>
          </thead>
          <tbody>
            {violations.length > 0 ? (
              violations.map((violation, index) => (
                <tr key={index}>
                  <td>{violation.violation_number}</td>
                  <td>{new Date(violation.violation_date).toLocaleDateString()}</td>
                  <td>{violation.violation_time}</td>
                  <td>{violation.violation_location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">위반 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default M_detail;
