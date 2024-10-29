import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Download = () => {
  const [isDownloading, setIsDownloading] = useState(false); // 다운로드 상태 관리
  const location = useLocation();

  // ViolationsList에서 전달된 데이터
  const previewData = location.state?.previewData || [];

  const handleDownloadClick = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert('다운로드가 완료되었습니다.');
    }, 2000);
  };

  return (
    <div className="download_container">
      <div className={`download_preview ${isDownloading ? 'blur' : ''}`}>
        {previewData.length > 0 ? (
          <table className="preview_table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>차량번호</th>
                <th>장소</th>
                <th>주차시간</th>
                <th>이용구역</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((item, index) => (
                <tr key={index}>
                  <td>{item.날짜}</td>
                  <td>{item.차량번호}</td>
                  <td>{item.장소}</td>
                  <td>{item.주차시간}</td>
                  <td>{item.이용구역}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>다운로드할 데이터가 없습니다.</p>
        )}
      </div>

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
