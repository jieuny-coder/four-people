import React from 'react'
import { useState } from 'react';

const BTN = () => {
  const [isBlack, setIsBlack] = useState(true);
  // 버튼 클릭 핸들러
  const handleClick = () => {
    setIsBlack(!isBlack); // 버튼을 클릭하면 색상이 토글되도록 설정
  };

    return (
    <div className="button-container">
      {/* isBlack 상태에 따라 버튼 색상이 결정됨 */}
      <div
        className={isBlack ? "black-button" : "yellow-button"} // 검정색 또는 노란색 버튼 스타일
        onClick={handleClick} // 클릭 시 색상 변경
      >
        <div className="button-inner">
          <div className="button-child"></div>
        </div>
        <div className="button-text">
          {isBlack ? "검정 버튼" : "노랑 버튼"} {/* 버튼 텍스트도 바뀔 수 있음 */}
        </div>
      </div>
    </div>
  );
}

export default BTN