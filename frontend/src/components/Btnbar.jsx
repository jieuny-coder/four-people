import React from 'react'

const Btnbar = () => {
  return (
    <div className="bottom-bar">
      <div className="button">
        <img src="/images/house.png" alt="Home" />
        <p>HOME</p>
      </div>
      <div className="button">
        <img src="/images/car.png" alt="위반차량정보" />
        <p>위반차량정보</p>
      </div>
      <div className="button">
        <img src="/images/download.png" alt="다운로드" />
        <p>다운로드</p>
      </div>
      <div className="button">
        <img src="/images/setting.png" alt="설정" />
        <p>설정</p>
      </div>
    </div>
  )
}

export default Btnbar