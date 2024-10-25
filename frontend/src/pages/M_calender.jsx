import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const M_calender = () => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSearch = () => {
    console.log('조회하기:', startTime, endTime);
    // 조회하기 버튼 눌렀을 때 어떻게 되는지 로직 추가하기 
  };

  return (
    <div className="m_calender-container-unique">
      <Calendar
        onChange={setDate}
        value={date}
        locale="en-US"  // 영어로 변경
        className="m_calender-unique"
        tileClassName={({ date, view }) => {
          if (view === 'month') {
            if (date.getDay() === 0 || date.getDay() === 6) {
              return 'm_calender-weekend-unique'; // 주말 색상
            }
            if (date.toDateString() === new Date().toDateString()) {
              return 'm_calender-tile-active-unique'; // 선택된 날짜 색상
            }
            return 'm_calender-tile-unique';
          }
        }}
        tileDisabled={({ activeStartDate, date, view }) => view === 'month' && date.getMonth() !== activeStartDate.getMonth()} // 이전, 이후 달의 날짜 비활성화
        showNeighboringMonth={false} // 이전, 이후 달의 날짜 숨김
      />
       {/* 기간 조회 및 시간 선택 섹션 */}
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
        {/* 조회하기 버튼 */}
        <button className="m_calender-search-button-unique" onClick={handleSearch}>
          조회하기
        </button>
      </div>
    </div>
  );
};

export default M_calender;
