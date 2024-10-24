import React from 'react';

const M_btnBar = () => {
  return (
    <div className="btn_bar_container">
      <div className="btn_bar">
        <div className="btn_item">
          <img src={`${process.env.PUBLIC_URL}/images/house.png`} alt="Home Icon" className="btn_icon" />
          <p>HOME</p>
        </div>
        <div className="btn_item">
          <img src={`${process.env.PUBLIC_URL}/images/car.png`} alt="Car Icon" className="btn_icon" />
          <p>위반차량정보</p>
        </div>
        <div className="btn_item active">
          <img src={`${process.env.PUBLIC_URL}/images/download.png`} alt="Download Icon" className="btn_icon" />
          <p>다운로드</p>
        </div>
        <div className="btn_item">
          <img src={`${process.env.PUBLIC_URL}/images/setting.png`} alt="Settings Icon" className="btn_icon" />
          <p>설정</p>
        </div>
      </div>
      {/* 홈바 이미지 추가 */}
      <div className="home_bar">
        <img src={`${process.env.PUBLIC_URL}/images/homebar.png`} alt="Home Bar" className="home_bar_icon" />
      </div>
    </div>
  );
};

export default M_btnBar;
