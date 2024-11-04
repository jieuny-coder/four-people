import React, { useState } from 'react';
import ParkingMa from '../components/ParkingMa';
import { useNavigate } from 'react-router-dom';

export const ParkingSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const inputValue = document.getElementById('searchInput').value;
    setSearchTerm(inputValue);
  };
  // 주소를 클릭 하면 목록 페이지로 이동하며 주소 전달
  const handleAddressClick = (address) => {
    navigate('/address-list',{state : {address}});
  }

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
        <ParkingMa searchTerm={searchTerm} onAddressClick={handleAddressClick}/>
      </div>
    </div>
  );
};

export default ParkingSearch;
