import React, { useState } from 'react';

const Download = () => {
  const [isDownloading, setIsDownloading] = useState(false); // 다운로드 상태 관리

  const handleDownloadClick = () => {
    setIsDownloading(true); // 다운로드 시작 시 true로 설정
    // 다운로드 로직을 추가할 수 있습니다.
  };

  return (
    <div className="download_container">
      {/* 다운로드 미리보기 */}
      <div className={`download_preview ${isDownloading ? 'blur' : ''}`}>
        {/* 여기에 detail 페이지에서 조회한 데이터 미리보기 컴포넌트를 넣어주세요 */}
        <p>Detail 페이지의 데이터를 여기에 표시</p>
      </div>

      {/* 다운로드 메시지 (다운로드 중일 때만 표시) */}
      {isDownloading && (
        <div className="download_message_overlay">
          <img src="/images/DownIMG.jpg" alt="Download Icon" className="download_icon" />
          <p>Please wait for a moment ...</p>
        </div>
      )}

      <button className="download_button" onClick={handleDownloadClick}>Download</button>
    </div>
  );
};

export default Download;
