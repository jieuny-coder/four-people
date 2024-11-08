import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Filtering = () => {
  const [selectedTime, setSelectedTime] = useState(''); // 조회시간 필터
  const [selectedOrder, setSelectedOrder] = useState(''); // 정렬 순서
  const [carNumber, setCarNumber] = useState(''); // 차량 번호 입력
  const [startTime, setStartTime] = useState(''); // 시작 시간
  const [endTime, setEndTime] = useState(''); // 종료 시간
  const [isTimeDisabled, setIsTimeDisabled] = useState(false); // 조회 시간 버튼 비활성화 여부
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 전달된 날짜 정보 가져오기
  const queryParams = new URLSearchParams(location.search);
  const selectedDate = queryParams.get('date'); // 달력에서 선택한 날짜
  const startDate = queryParams.get('start'); // 달력 페이지에서 전달된 시작 날짜
  const endDate = queryParams.get('end'); // 달력 페이지에서 전달된 종료 날짜
  const mode = queryParams.get('mode');  // 모드 확인 ( 기간 조회인지 시간 조회인지 )

  // 컴포넌트가 마운트될 때 현재 시간을 기준으로 startTime과 endTime 설정
  useEffect(() => {
    const now = new Date();
    const localNow = new Date(now.getTime() + 9 * 60 * 60 * 1000); // 한국 시간으로 변환

    // 시작 시간과 종료 시간을 현재 시간으로 설정
    setStartTime(localNow.toISOString().slice(0, 16).replace('T', ' ')); // "YYYY-MM-DD HH:mm" 형식
    setEndTime(localNow.toISOString().slice(0, 16).replace('T', ' ')); // "YYYY-MM-DD HH:mm" 형식
  }, []);

  // startDate와 endDate가 존재하고 mode가 'period'인 경우 시간 버튼과 드롭다운 비활성화
  useEffect(() => {
    if (startDate && endDate && mode === 'period') {
      setIsTimeDisabled(true);
      // 시작 시간과 종료 시간을 고정 (00:00 ~ 23:59)
      setStartTime(`${startDate} 00:00:00`);
      setEndTime(`${endDate} 23:59:59`);
    }
  }, [startDate, endDate, mode]);


  // 날짜와 시간을 포함한 DateTime 형식으로 변환하는 함수
  const formatDateTime = (date, time) => {
    return `${date} ${time}:00`; // "YYYY-MM-DD HH:MM:SS" 형식
  };

  // 조회시간 버튼 클릭 시 처리
  const handleTimeClick = (time) => {
    if (isTimeDisabled) return;

    const now = new Date();
    const localNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    let start = new Date(localNow);

    // 시작 시간을 시간 버튼에 따라 조정
    if (time === '6시간') {
      start.setHours(localNow.getHours() - 6);
    } else if (time === '12시간') {
      start.setHours(localNow.getHours() - 12);
    } else if (time === '24시간') {
      start.setHours(localNow.getHours() - 24);
    }

    const formattedStart = formatDateTime(selectedDate,
      start.getHours().toString().padStart(2, '0') + ':' + start.getMinutes().toString().padStart(2, '0'));
    const formattedEnd = formatDateTime(selectedDate,
      localNow.getHours().toString().padStart(2, '0') + ':' + localNow.getMinutes().toString().padStart(2, '0'));

    console.log('Formatted Start:', formattedStart); // 로그 추가
    console.log('Formatted End:', formattedEnd); // 로그 추가

    setSelectedTime(time);
    setStartTime(formattedStart); // 시작 시간 설정
    setEndTime(formattedEnd); // 종료 시간 설정
  };

  // 정렬 버튼 클릭 시 처리
  const handleOrderClick = (order) => {
    setSelectedOrder(order); // 선택한 정렬 순서를 설정
  };

  // 조회하기 버튼 클릭 시 처리
  const handleSearch = () => {
    const query = new URLSearchParams();
    query.append("carNumber", carNumber);

    if (selectedTime) {
      query.append("selectedTime", selectedTime);
    } else {
      query.append("start", startTime);
      query.append("end", endTime);
    }

    if (selectedOrder) query.append("order", selectedOrder);
    if (selectedDate) query.append("date", selectedDate);
    if (startDate) query.append("start", startDate);
    if (endDate) query.append("end", endDate);

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
              disabled={isTimeDisabled}
            >6시간</button>
            <button
              onClick={() => handleTimeClick('12시간')}
              className={selectedTime === '12시간' ? 'filtering-active' : ''}
              disabled={isTimeDisabled}
            >12시간</button>
            <button
              onClick={() => handleTimeClick('24시간')}
              className={selectedTime === '24시간' ? 'filtering-active' : ''}
              disabled={isTimeDisabled}
            >24시간</button>
          </div>

          {/* 정렬 */}
          <div className="filtering-order-buttons">
            <button
              onClick={() => handleOrderClick('최신순')}
              className={selectedOrder === '최신순' ? 'filtering-active' : ''}
              disabled={isTimeDisabled}
            >최신순</button>
            <button
              onClick={() => handleOrderClick('과거순')}
              className={selectedOrder === '과거순' ? 'filtering-active' : ''}
              disabled={isTimeDisabled}
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
                setStartTime(formatDateTime(selectedDate, e.target.value));
                setSelectedTime(''); // 조회시간 선택 해제
              }}
              className="filtering-input"
              disabled={isTimeDisabled}
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
                setEndTime(formatDateTime(selectedDate, e.target.value));
                setSelectedTime(''); // 조회시간 선택 해제
              }}
              className="filtering-input"
              disabled={isTimeDisabled}
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
