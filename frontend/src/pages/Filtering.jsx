import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Filtering = () => {
  const [selectedTime, setSelectedTime] = useState(''); // 조회시간 필터
  const [selectedOrder, setSelectedOrder] = useState(''); // 정렬 순서
  const [carNumber, setCarNumber] = useState(''); // 차량 번호 입력
  const [startTime, setStartTime] = useState(''); // 시작 시간
  const [endTime, setEndTime] = useState(''); // 종료 시간
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 전달된 날짜 정보 가져오기
  const queryParams = new URLSearchParams(location.search);
  const selectedDate = queryParams.get('date'); // 달력에서 선택한 날짜

  // 조회시간 버튼 클릭 시 처리
  const handleTimeClick = (time) => {
    const now = new Date();
    let start = new Date(now);

    if (time === '6시간') {
      start.setHours(now.getHours() - 6);
    } else if (time === '12시간') {
      start.setHours(now.getHours() - 12);
    } else if (time === '24시간') {
      start.setHours(now.getHours() - 24);
    }

    setSelectedTime(time);
    setStartTime(start.toISOString().substring(11, 16)); // "HH:MM" 형식
    setEndTime(now.toISOString().substring(11, 16));      // 현재 시간 설정
  };

  // 정렬 버튼 클릭 시 처리
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  // 조회하기 버튼 클릭 시 처리
  const handleSearch = () => {
    const query = new URLSearchParams();
    query.append("carNumber", carNumber);

    if (selectedTime) {
      query.append("selectedTime", selectedTime);
    } else if (startTime && endTime) {
      query.append("start", startTime);
      query.append("end", endTime);
    }

    if (selectedOrder) query.append("order", selectedOrder);
    if (selectedDate) query.append("date", selectedDate); // 달력에서 선택한 날짜 전달

    navigate(`/detail?${query.toString()}`);
  };

  return (
    <div className="filtering-page-container">
      <div className="filtering-page-box">
        {/* 차량번호 입력 */}
        <div className="filtering-input-group">
          <label htmlFor="carNumber" className="filtering-label">차량번호</label>
          <input
            type="text"
            placeholder="차량 번호를 입력하세요."
            value={carNumber}
            onChange={(e) => setCarNumber(e.target.value)}
            className="filtering-input"
          />
        </div>

        <hr className="filtering_line" />

        {/* 조회시간 */}
        <div className="filtering-time-section">
          <p className="filtering-section-title">조회시간</p>
          <div className="filtering-time-buttons">
            <button
              onClick={() => handleTimeClick('6시간')}
              className={selectedTime === '6시간' ? 'filtering-active' : ''}
            >6시간</button>
            <button
              onClick={() => handleTimeClick('12시간')}
              className={selectedTime === '12시간' ? 'filtering-active' : ''}
            >12시간</button>
            <button
              onClick={() => handleTimeClick('24시간')}
              className={selectedTime === '24시간' ? 'filtering-active' : ''}
            >24시간</button>
          </div>

          {/* 정렬 */}
          <div className="filtering-order-buttons">
            <button
              onClick={() => handleOrderClick('최신순')}
              className={selectedOrder === '최신순' ? 'filtering-active' : ''}
            >최신순</button>
            <button
              onClick={() => handleOrderClick('과거순')}
              className={selectedOrder === '과거순' ? 'filtering-active' : ''}
            >과거순</button>
          </div>
        </div>

        {/* 시간 조회 */}
        <div className="filtering-time-range">
          <p className="filtering-section-title">시간 조회</p>
          <div className="filtering-time-inputs">
            <select
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setSelectedTime(''); // 조회시간 선택 해제
              }}
              className="filtering-input"
            >
              <option value="">시작 시간</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
            </select>
            <span className="filtering-time-divider">~</span>
            <select
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setSelectedTime(''); // 조회시간 선택 해제
              }}
              className="filtering-input"
            >
              <option value="">종료 시간</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
            </select>
          </div>
        </div>

        {/* 조회하기 버튼 */}
        <button className="filtering-search-button" onClick={handleSearch}>조회하기</button>
      </div>
    </div>
  );
};

export default Filtering;
