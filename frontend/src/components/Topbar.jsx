import React, { useState, useEffect } from 'react';

const Topbar = () => {
  const [time, setTime] = useState('');

  // 현재 시간을 설정하는 함수
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateClock(); // 컴포넌트가 로드될 때 시간 업데이트
    const interval = setInterval(updateClock, 60000); // 1분마다 시간 업데이트

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
  }, []);

  return (
    <div className="topbar">
    <span className="time">{time}</span>
    <div className="status-icons">
        <img src="/images/car.jpg" alt="Signal Icon" className="icon" />
        <img src="/images/wifi.png" alt="Wi-Fi Icon" className="icon" />
        <img src="/images/_battery.png" alt="Battery Icon" className="icon" />
      </div>
  </div>
  )
}

export default Topbar