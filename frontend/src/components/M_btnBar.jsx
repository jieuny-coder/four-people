import React from 'react';
import { useNavigate } from 'react-router-dom';

const M_btnBar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleDownload = () => {
    alert("다운로드가 시작됩니다.");
    // 다운로드 기능 추가 가능
  };

  return (
    <div className="btn_bar_container">
      <div className="btn_bar">
        <div className="btn_item" onClick={() => handleNavigation('/M_calender')} style={{ cursor: 'pointer' }}>
          <img src={`${process.env.PUBLIC_URL}/images/house.png`} alt="Home Icon" className="btn_icon" />
          <p>HOME</p>
        </div>
        <div className="btn_item" onClick={() => handleNavigation('/ViolationsList')} style={{ cursor: 'pointer' }}>
          <img src={`${process.env.PUBLIC_URL}/images/car.png`} alt="Car Icon" className="btn_icon" />
          <p>위반차량정보</p>
        </div>
        <div className="btn_item active" onClick={handleDownload} style={{ cursor: 'pointer' }}>
          <img src={`${process.env.PUBLIC_URL}/images/download.png`} alt="Download Icon" className="btn_icon" />
          <p>다운로드</p>
        </div>
        <div className="btn_item" onClick={() => handleNavigation('/setting')} style={{ cursor: 'pointer' }}>
          <img src={`${process.env.PUBLIC_URL}/images/setting.png`} alt="Settings Icon" className="btn_icon" />
          <p>설정</p>
        </div>
      </div>
      {/* <div className="home_bar">
        <img src={`${process.env.PUBLIC_URL}/images/homebar.png`} alt="Home Bar" className="home_bar_icon" />
      </div> */}
    </div>
  );
};

export default M_btnBar;
