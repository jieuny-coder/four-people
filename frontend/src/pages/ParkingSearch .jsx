import React, { useState } from 'react';
import ParkingMa from '../components/ParkingMa';

export const ParkingSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const inputValue = document.getElementById('searchInput').value;
    setSearchTerm(inputValue);
  };

  return (
    <div className="parking-container">
      <div className='parking_search'>
        <div className="address-input">
          <p>주소를 입력해주세요.</p>
        </div>
        <div className="searchbox">
          <div className="searchbox-container">
            <input
              id="searchInput"
              className="box"
              type="text"
              placeholder="목적지 또는 주소 검색"
            />
            <button className="searchbox-btn" onClick={handleSearch}>검색</button>
          </div>
        </div>
        <div className="example">
          <p>
            이렇게 검색해보세요!
            <br />· 도로명 + 건물번호 (예: 정자일로 95, 불정로 6)
            <br />· 동/읍/면/리 + 번지 (예: 정자동 178-4, 동면 만천리 1000)
          </p>
        </div>
      </div>
      {/* 지도 컴포넌트가 parking_search 아래에 위치 */}
      <div className="map-container">
        <ParkingMa searchTerm={searchTerm} />
      </div>
    </div>
  );
};

export default ParkingSearch;
