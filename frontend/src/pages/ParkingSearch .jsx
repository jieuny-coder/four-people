import React ,{ useState } from 'react';
import Btnbar from '../components/Btnbar';
import '../index.css';
import BannerBox from '../components/BannerBox';
import ParkingMa from '../components/ParkingMa';


export const ParkingSearch  = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const inputValue = document.getElementById('searchInput').value;
    setSearchTerm(inputValue);
  };

  return (
    <div>
      <Btnbar />
      <BannerBox />
      <div className='ad'>
        <p>주소를 입력해주세요.</p>
      </div>
      <div className='ch'>
        <div className='input-container'>
          <input
            id='searchInput'
            className='box'
            type='text'
            placeholder='목적지 또는 주소 검색'
          />
          <button className='search_1' onClick={handleSearch}>검색</button>
        </div>
      </div>
      <div className='texts'>
        <p className='texts'>
          이렇게 검색해보세요!
          <br />· 도로명 + 건물번호
          <br /> 예)정자일로 95, 불정로6
          <br />· 동/읍/면/리 + 번지
          <br /> 예)정자동 178-4, 동면 만천리 1000
        </p>
        <div className='parkingMaps'>
          <ParkingMa searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}

  

  