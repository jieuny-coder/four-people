// M_calender 페이지 코드
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';

const M_calender = () => {
  const [date, setDate] = useState(new Date()); // 기본 날짜
  const [startDate, setStartDate] = useState(null); // 시작 날짜
  const [endDate, setEndDate] = useState(null); // 종료 날짜
  const navigate = useNavigate();

  // 조회하기 버튼 클릭 시 실행되는 함수
  const handleSearch = () => {
    if (!startDate || !endDate) {
      alert("시작 기간과 종료 기간을 선택해 주세요.");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      alert("시작 날짜는 종료 날짜보다 먼저여야 합니다.");
      return;
    }

    navigate(`/detail?start=${startDate.toISOString().split("T")[0]}&end=${endDate.toISOString().split("T")[0]}`);
  };

  // 날짜 클릭 시 필터링 페이지로 이동하는 함수
  const handleDayClick = (selectedDate) => {
    setDate(selectedDate);
    navigate(`/filtering?date=${selectedDate.toISOString().split("T")[0]}`);
  };

  return (
    <div className="m_calender-container-unique">
      <Calendar
        onChange={setDate}
        value={date}
        locale="en-US"
        onClickDay={handleDayClick} // 날짜 클릭 시 handleDayClick 함수 실행
        className="m_calender-unique"
      />

      <div className="m_calender-time-select-unique">
        <p className="m_calender-label-unique">기간 조회</p>
        <div className="m_calender-time-inputs-unique">
          <input
            type="date"
            value={startDate ? startDate.toISOString().split("T")[0] : ''}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="m_calender-input-unique"
            placeholder="시작 기간"
          />
          <span className="m_calender-time-divider-unique">~</span>
          <input
            type="date"
            value={endDate ? endDate.toISOString().split("T")[0] : ''}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="m_calender-input-unique"
            placeholder="종료 기간"
          />
        </div>
        <button className="m_calender-search-button-unique" onClick={handleSearch}>
          조회하기
        </button>
      </div>
    </div>
  );
};

export default M_calender;
