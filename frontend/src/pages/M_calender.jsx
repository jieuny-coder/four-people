import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import 'react-calendar/dist/Calendar.css';

const M_calender = () => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleSearch = () => {
    console.log('조회하기:', startTime, endTime);
    // 조회하기 로직 추가 가능
  };

  const handleDayClick = () => {
    navigate('/detail'); // 날짜 클릭 시 detail 페이지로 이동
  };

  return (
    <div className="m_calender-container-unique">
      <Calendar
        onChange={setDate}
        value={date}
        locale="en-US"
        onClickDay={handleDayClick} // 날짜 클릭 시 페이지 이동
        className="m_calender-unique"
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            if (date.getDay() === 0 || date.getDay() === 6) {
              return 'm_calender-weekend-unique';
            }
            if (date.toDateString() === new Date().toDateString()) {
              return 'm_calender-tile-active-unique';
            }
            return 'm_calender-tile-unique';
          }
        }}
        tileDisabled={({ activeStartDate, date, view }) => view === 'month' && date.getMonth() !== activeStartDate.getMonth()}
        showNeighboringMonth={false}
      />
      <div className="m_calender-time-select-unique">
        <p className="m_calender-label-unique">기간 조회</p>
        <div className="m_calender-time-inputs-unique">
          <input
            type="text"
            placeholder="시작 시간"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="m_calender-input-unique"
          />
          <span className="m_calender-time-divider-unique">~</span>
          <input
            type="text"
            placeholder="종료 시간"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="m_calender-input-unique"
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
