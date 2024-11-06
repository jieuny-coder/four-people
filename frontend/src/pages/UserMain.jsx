import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserMain = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ user_name: '', car_number: '' });

  useEffect(() => {
    // 세션 기반으로 사용자 정보를 서버에서 가져옴
    fetch('http://localhost:4000/user/userinfo',{
      credentials: 'include' // 세션 쿠키를 포함하여 요청
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error("오류:", data.error);
          if (data.error === '로그인이 필요합니다.') {
            navigate('/login'); // 로그인 필요 시 로그인 페이지로 이동
          }
        } else {
          setUserInfo(data); // 사용자 정보 상태 설정
        }
      })
      .catch(error => console.error("API 호출 오류:", error));
  }, [navigate]);


  const clean = () => {
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
          <p>이름 : {userInfo.user_name}</p>
          <p>번호 : {userInfo.car_number}</p>
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
