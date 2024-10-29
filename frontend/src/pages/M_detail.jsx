import React from 'react';
import { useLocation } from 'react-router-dom';

const M_detail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date'); // 달력에서 선택한 날짜
  const startDate = queryParams.get('start'); // 조회 시작 날짜 (직접 설정된 시간)
  const endDate = queryParams.get('end'); // 조회 종료 날짜 (직접 설정된 시간)
  const carNumber = queryParams.get('carNumber'); // 차량 번호
  const selectedTime = queryParams.get('selectedTime'); // 조회 시간 (6시간, 12시간, 24시간)

  // 예시 데이터를 위한 violations 배열 정의
  const violations = ['위반내역 1', '위반내역 2']; // 실제 데이터를 가져올 수 있다면 여기서 불러와 사용

  let startTimeDisplay = startDate;
  let endTimeDisplay = endDate;

  // 조회 시간이 선택된 경우 현재 시간 기준으로 계산
  if (selectedTime) {
    const now = new Date();
    const start = new Date(now);

    if (selectedTime === '6시간') {
      start.setHours(now.getHours() - 6);
    } else if (selectedTime === '12시간') {
      start.setHours(now.getHours() - 12);
    } else if (selectedTime === '24시간') {
      start.setHours(now.getHours() - 24);
    }

    startTimeDisplay = start.toTimeString().slice(0, 5); // "HH:MM" 형식으로 변환
    endTimeDisplay = now.toTimeString().slice(0, 5); // 현재 시간을 "HH:MM" 형식으로 변환
  }

  return (
    <div className="m_detail-container-unique">
      {/* 필터링 조건 표시 */}
      <div className="m_detail-filter-unique">
        <div className="m_detail-filter-info-unique">
          {/* 차량번호 표시 */}
          {carNumber && <p>차량번호: {carNumber}</p>}
          
          {/* 달력에서 선택한 날짜 표시 */}
          {date && <p>선택된 날짜: {date}</p>}
          
          {/* 조회 기간이 설정된 경우 표시 */}
          {startTimeDisplay && endTimeDisplay && (
            <p>조회 기간: {startTimeDisplay} ~ {endTimeDisplay} ({selectedTime})</p>
          )}
        </div>
      </div>

      {/* 사진 표시 영역 */}
      <div className="m_detail-photo-unique">
        <div className="m_detail-photo-box-unique">사진</div>
      </div>

      {/* 위반 내역을 동적으로 생성 */}
      <div className="m_detail-violation-unique">
        {violations.length > 0 ? (
          violations.map((violation, index) => (
            <div key={index} className="m_detail-violation-row-unique">{violation}</div>
          ))
        ) : (
          <p>위반 내역이 없습니다.</p> // 위반 내역이 없을 때 표시
        )}
      </div>
    </div>
  );
};

export default M_detail;
