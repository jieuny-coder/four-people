import React from 'react'
import Btnbar from '../components/Btnbar';
import '../index.css';
import BannerBox from '../components/BannerBox';
import { useNavigate } from 'react-router-dom';

export const Parkinglot04 = () => {
  const navigate = useNavigate();

  const clean=()=>{
    navigate('/parkinglot05')
  }

  return (
    <div>
        {/* css 텍스트 div 20*/}
      <Btnbar/>
      <div><BannerBox/></div>
      <div className='all'>
      <div className='one'>
        <div className='ones'>
            <p>이름 :</p>
            <br></br>
            <p>번호 : </p>
        </div>
        <div className='pt'>사진</div>
        <button className='members' onClick={clean}>회원정보수정</button>
      </div>
      <div className='two'>
        <button className='pk'>주차장 조회하기</button>
        <img className='p-icon' alt='돋보기' src="/images/P.png"/>
      </div>
      <div className='three'>
        <button className='my-pk'>나의 주차장</button>
        <img className='parking-icon' alt='주차장' src="/images/parking.png"/>
      </div>
      </div>
    </div>
  )
}
