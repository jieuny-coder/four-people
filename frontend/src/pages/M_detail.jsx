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
    const selectedDateTime = new Date(date); // 선택한 날짜
    const now = new Date(); // 현재 시간
    selectedDateTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    const start = new Date(selectedDateTime); // 선택한 날짜의 시작 시간으로 설정

    // 시작 시간을 시간 버튼에 따라 조정
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
    endTimeDisplay = formatDateTime(selectedDateTime); // 선택한 날짜의 시간을 포함
  }

  // 시간을 화면에 표시할 때 형식 조정 함수
  const formatDisplayTime = (dateTime) => {
    return dateTime.slice(0, 16); // "YYYY-MM-DD HH:MM" 형식으로 화면에 보여지기 
  };


  // API 호출을 위한 useEffect 추가
  useEffect(() => {
    const fetchData = async () => {
      try {
        // API 요청 파라미터 확인을 위한 console.log 추가
        console.log('API 요청 파라미터:', {
          startDate: startDate ? `${startDate} 00:00:00` : '',
          endDate: endDate ? `${endDate} 23:59:59` : '',
          date,
          carNumber,
          startTimeDisplay,
          endTimeDisplay
      });

      let response;
        if (startDate && endDate) {
          // 기간 조회 API 호출
          console.log('기간 조회 API 호출');
          response = await axios.get('http://localhost:4000/violation/filtering_dateRange', {
            params: {
              startDate: `${startDate} 00:00:00`, // 조회 시작 날짜
              endDate: `${endDate} 23:59:59` // 조회 종료 날짜
            }
          });
        } else if (date && carNumber && startTimeDisplay && endTimeDisplay) {
          // 기존의 filter_Violations API 호출
          console.log('기본 조회 API 호출');
          response = await axios.get('http://localhost:4000/violation/filter_Violations', {
            params: {
              date,
              car_number: carNumber,
              startTime: startTimeDisplay,
              endTime: endTimeDisplay
            }
          });
        } else {
          console.log('필수 파라미터가 없습니다. API 호출 생략');
          setLoading(false);
          return;
        }

        console.log('응답 데이터:', response.data); // 응답 데이터 확인
        setViolations(response.data); // 데이터 상태 저장
      } catch (error) {
        console.error('위반데이터 패치 실패:', error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    // 필요한 파라미터가 있을 때만 API 호출
    if (date && carNumber) {
      fetchData();
    }
  }, [date, carNumber, startTimeDisplay, endTimeDisplay]); // 의존성 배열에 파라미터 추가


  // 로딩 중일 경우
  // if (loading) return <p>Loading...</p>;

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
              <td>{formatDisplayTime(startTimeDisplay)} ~ {formatDisplayTime(endTimeDisplay)}<br />({selectedTime})</td>
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
