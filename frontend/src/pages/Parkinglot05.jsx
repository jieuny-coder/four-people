import React from 'react'
import BannerBox from '../components/BannerBox'

export const Parkinglot05 = () => {
  return (
    <div>
        <div><BannerBox/></div>
        <div className='name01'>이름</div>
        <input className='box01' type='text' placeholder='이름을 입력해 주세요.'/>
        <div className='name01'>비밀번호 <p className='red'>20자 이내의 비밀번호를 입력해주세요.</p></div>
        <input className='box01' type='text' placeholder='비밀번호 입력(문자,숫자,특수문자 포함 8-20자)'/>
        <div className='name01'>비밀번호 확인 <p className='red01'>비밀번호가 일치하지 않습니다.</p></div>
        <input className='box01' type='text' placeholder='비밀번호 재입력'/>
        <div className='name01'>차량번호</div>
        <input className='box01' type='text' placeholder='차량 번호를 입력하세요.'/>
        <div className='name01'>전화번호</div>
        <input className='box01' type='text' placeholder='휴대폰 번호 입력(`-`제외 11자리 입력)'/>
        <div className='name01'>이메일 주소</div>
        <input className='box02' type='text' placeholder='이메일 주소'/><img className='gol' alt='' src='/images/gol.png'/><input className='box02' type='text' placeholder='gmail.com'/>
        <button className='box03'>수정하기</button>
        <img className='pi' alt='' src='/images/background.png'/>
        

    </div>
  )
}
