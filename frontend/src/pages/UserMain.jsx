import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const UserMain = () => {
  const navigate = useNavigate();
  const [revise,setRivis] = useState({
    name:'',
    pw:'',
    car_number:'',
    phonenumber:'',
    email:''
  });

  const clean = async() => {
    navigate('/editprofile');
  };

  const goToParkingSearch = () => {
    navigate('/parkingSearch');
  };

  const goToParkingList = () => {
    navigate('/parkinglist');
  };

  return (
    <div className='user_container'>
      <div className='user_info_box'>
        <div className='photo'>
          <img src='#' alt='프사' />
        </div>
        <div className='user_info'>
          <p>이름 :</p>
          <p>번호 :</p>
          <button className='members_edit_btn' onClick={clean}>회원정보수정</button>
        </div>
      </div>
      <div className='parking_search_box' onClick={goToParkingSearch} style={{ cursor: 'pointer' }}>
        <button className='parking_search'>주차장 조회하기</button>
        <img className='p_icon' alt='돋보기' src='/images/P.png' />
      </div>
      <div className='my_parking_list' onClick={goToParkingList} style={{ cursor: 'pointer' }}>
        <img className='parking_icon' alt='주차장' src='/images/parking.png' />
        <button className='my_pk_list'>나의 주차장</button>
      </div>
    </div>
  )
}
