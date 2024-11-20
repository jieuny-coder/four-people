import React from 'react';
import { useLocation } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ReactPlayer from 'react-player';
import Obstacle_pdf_from from '../components/Obstacle_pdf_from';

const Obstacle_detail = () => {
  const location = useLocation();
  const { obstacle } = location.state || {}; // 전달된 데이터 가져오기

  if (!obstacle) {
    return <p>적재물 데이터를 불러올 수 없습니다.</p>;
  }

  // 탐지 날짜와 시간 분리
  const detectedDate = new Date(obstacle.detected_at).toLocaleDateString();
  const detectedTime = new Date(obstacle.detected_at).toLocaleTimeString();

  // 동영상 다운로드 핸들러
  const handleVideoDownload = async  () => {
    if (!obstacle.video_url) {
      alert('다운로드할 동영상이 없습니다.');
      return;
    }
  
    try {
      // 프록시 서버 URL 설정
      const proxyUrl = `http://localhost:4001/download?url=${encodeURIComponent(obstacle.video_url)}`;
      console.log('Downloading via proxy:', proxyUrl);
  
      // 프록시 서버로 요청 보내기
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch video via proxy');
      }
  
      // Blob 데이터 생성
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
  
      // Blob을 사용해 다운로드 트리거
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'obstacle_video.mp4'; // 다운로드될 파일 이름 지정
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // Blob URL 해제
    } catch (error) {
      console.error('Download error:', error);
      alert('동영상 다운로드 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="obstacle-detail-unique-container">
      {/* 테이블 */}
      <table className="obstacle-detail-unique-table">
        <tbody>
          <tr>
            <td><strong>적재물 유형</strong></td>
            <td>{obstacle.description}</td>
          </tr>
          <tr>
            <td><strong>탐지 날짜</strong></td>
            <td>{detectedDate}</td>
          </tr>
          <tr>
            <td><strong>탐지 시간</strong></td>
            <td>{detectedTime}</td>
          </tr>
        </tbody>
      </table>

      {/* 동영상 썸네일 및 재생 */}
      <div className="obstacle-detail-unique-image-box">
        {obstacle.video_url ? (
          <ReactPlayer
            url={obstacle.video_url} // 동영상 URL
            controls // 재생 컨트롤러 활성화
            width="100%" // 전체 너비
            height="100%" // 고정 높이
            playing={false} // 자동 재생 비활성화
            className="react-player"
          />
        ) : (
          '동영상 정보가 없습니다.'
        )}
      </div>

      {/* 다운로드 버튼 섹션 */}
      <div className="obstacle-detail-unique-download-section">
        {/* PDF 다운로드 버튼 */}
        <PDFDownloadLink
          document={<Obstacle_pdf_from obstacle={obstacle} />}
          fileName="Obstacle_Report.pdf"
        >
          {({ loading }) =>
            loading ? (
              <button className="obstacle-detail-unique-download-button">
                PDF 생성 중...
              </button>
            ) : (
              <button className="obstacle-detail-unique-download-button">
                PDF 다운로드
              </button>
            )
          }
        </PDFDownloadLink>

         {/* 동영상 다운로드 버튼 */}
         {obstacle.video_url && (
          <button
            className="obstacle-detail-unique-download-button"
            onClick={handleVideoDownload}
          >
            동영상 다운로드
          </button>
        )}
      </div>
    </div>
  );
};

export default Obstacle_detail;
