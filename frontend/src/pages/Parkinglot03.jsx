import React from 'react';
import Btnbar from '../components/Btnbar';
import '../index.css';
import BannerBox from '../components/BannerBox';
import ParkingMa from '../components/ParkingMa';


export const Parkinglot03 = () => {
  
  

  return (
    <div>
      {/* css 텍스트 div 20*/}
      <div><Btnbar/></div>
      <div><BannerBox/></div>
      <div className='ad'>
        <p>주소를 입력해주세요.</p>
      </div>
      <div className='ch'>
            <div className='input-container'>
                <input className='box' type='text' placeholder='목적지 또는 주소 검색'/>
                <button className='search_1'>검색</button>
            </div>
        </div>
      <div className='texts'>
        <p className='texts'>이렇게 검색해보세요!
          <br></br>
          &nbsp;·  도로명 + 건물번호
          <br></br>
          &nbsp;&nbsp;  예)정자일로 95, 불정로6
          <br></br>
          &nbsp;·  동/읍/면/리 + 번지
          <br></br>
          &nbsp;&nbsp;   예)정자동 178-4, 동면 만천리 1000
        </p>
      </div>
      <div>
        {/* {/* Kakao 지도를 표시할 공간 *`/} */}
        <ParkingMa />
        </div>
      </div>

  
  )
}
