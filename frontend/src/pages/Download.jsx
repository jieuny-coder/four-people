import React from 'react';

// 다운로드한 아이콘 이미지를 불러오기
const Download = () => {
  return (
    <div className="download_container">
      <div className="download_message">
         <img src="/images/DownIMG.jpg" alt="Download Icon" className="download_icon" />
        <p>Please wait for a moment ...</p>
      </div>
      <button className="download_button">Download</button>
    </div>
  );
};

export default Download;
