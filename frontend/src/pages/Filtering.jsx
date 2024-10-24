import React, { useState } from 'react';

const Filtering = () => {
  const [selectedTime, setSelectedTime] = useState(''); // 시간 필터
  const [selectedOrder, setSelectedOrder] = useState(''); // 정렬 순서
  const [carNumber, setCarNumber] = useState(''); // 차량 번호 입력

  // 시간 필터 버튼 클릭 시 처리
  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  // 정렬 버튼 클릭 시 처리
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  // 조회하기 버튼 클릭 시 처리 (다음 페이지로 이동하는 로직 추가 가능)
  const handleSearch = () => {
    console.log('조회하기 클릭:', carNumber, selectedTime, selectedOrder);
    // 차량 번호와 선택한 필터에 따른 검색 처리 추가
  };

  return (
    <div className="filtering-page-container">
      <div className="filtering-page-box"> {/* 하얀색 배경을 위한 박스 */}

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

        {/* 시간 필터 */}
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
            <input type="text" placeholder="시작 시간" className="filtering-input" />
            <span className="filtering-time-divider">~</span>
            <input type="text" placeholder="종료 시간" className="filtering-input" />
          </div>
        </div>

        {/* 조회하기 버튼 */}
        <button className="filtering-search-button" onClick={handleSearch}>조회하기</button>
      </div>
    </div>
  );
};

export default Filtering;
