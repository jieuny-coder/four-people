import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDF_form from '../components/PDF_form';

const M_detail = ({ setData }) => {
  const location = useLocation();
  const { violation } = location.state || {};

  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date');
  const startDate = queryParams.get('start');
  const endDate = queryParams.get('end');
  const carNumber = queryParams.get('carNumber');
  const selectedTime = queryParams.get('selectedTime');

  const [violations, setViolations] = useState(violation ? [violation] : []);
  const [loading, setLoading] = useState(!violation);
  const [videos, setVideos] = useState([]);
  const [selectedCarNumber, setSelectedCarNumber] = useState(carNumber);

  let startTimeDisplay = startDate;
  let endTimeDisplay = endDate;

  // 동영상 다운로드 핸들러
  const handleVideoDownload = () => {
    // 동영상 URL 가져오기
    const videoUrl = videos[0]?.url; // 첫 번째 동영상 URL
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl; // 동영상 URL
      link.download = videoUrl.split('/').pop(); // URL에서 파일 이름 추출
      link.click(); // 다운로드 시작
    } else {
      alert('동영상이 없습니다.');
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '날짜 없음';
    const dateObj = new Date(isoDate);
    return isNaN(dateObj.getTime())
      ? '유효하지 않은 날짜'
      : `${String(dateObj.getFullYear()).slice(2)}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  };

  const formatTime = (isoDate) => {
    if (!isoDate) return '시간 없음';
    const dateObj = new Date(isoDate);
    return isNaN(dateObj.getTime())
      ? '유효하지 않은 시간'
      : `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
  };

  const formatDateTime = (date, showTimeOnly = false) => {
    if (!date) return '날짜 없음';
    const dateObj = new Date(date);
    return isNaN(dateObj.getTime())
      ? '유효하지 않은 날짜'
      : showTimeOnly
        ? `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`
        : `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
  };

  // 조회 시간 설정
  if (selectedTime) {
    const now = new Date();
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(now.getHours(), now.getMinutes(), 0, 0);

    const end = new Date(selectedDateTime);
    const start = new Date(selectedDateTime);

    if (selectedTime === '6시간') {
      start.setHours(selectedDateTime.getHours() - 6);
    } else if (selectedTime === '12시간') {
      start.setHours(selectedDateTime.getHours() - 12);
    } else if (selectedTime === '24시간') {
      start.setHours(selectedDateTime.getHours() - 24);
    }

    startTimeDisplay = formatDateTime(start);
    endTimeDisplay = formatDateTime(end);
  } else if (startDate && endDate) {
    startTimeDisplay = `${formatDateTime(startDate)}`;
    endTimeDisplay = `${formatDateTime(endDate)}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (startDate && endDate && carNumber) { // carNumber가 null이 아닌지 확인
          response = await axios.get('http://localhost:4000/violation/filtering_dateRange', {
            params: {
              startDate: startDate.split("T")[0],
              endDate: endDate.split("T")[0],
              car_number: carNumber  // 반드시 car_number로 전달
            }
          });
        } else if (date && carNumber && startTimeDisplay && endTimeDisplay) {
          response = await axios.get('http://localhost:4000/violation/filter_Violations', {
            params: {
              car_number: carNumber, // 반드시 car_number로 전달
              startTime: startTimeDisplay,
              endTime: endTimeDisplay
            }
          });
        } else {
          setLoading(false);
          return;
        }

        console.log('Fetched violations:', response.data);

        setViolations(response.data);
        if (setData) {
          setData(response.data);
        }

        // 동영상 데이터 가져오기
        if (carNumber) {
          const videoResponse = await axios.get('http://localhost:4000/violation/videos', {
            params: { violationNumber: carNumber }
          });
          console.log('Fetched videos:', videoResponse.data);
          setVideos(videoResponse.data); // 동영상 데이터를 상태에 저장
        }

      } catch (error) {
        console.error('위반 데이터 패치 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (violation || carNumber || (startDate && endDate)) {
      fetchData();
    }
  }, [violation, date, carNumber, startTimeDisplay, endTimeDisplay, startDate, endDate, setData]);


  // 차량 선택 핸들러
  const handleCarSelection = async (violationNumber, dateTime) => {
    console.log(`Selected car number: ${violationNumber}, dateTime: ${dateTime}`);
    setSelectedCarNumber(violationNumber);
    setVideos([]); // 동영상 데이터 초기화
    setLoading(true); // 로딩 상태 활성화

    try {
      const videoResponse = await axios.get('http://localhost:4000/violation/videos', {
        params: { violationNumber, dateTime } // 날짜+시간 전달
      });
      console.log('Fetched videos for car:', videoResponse.data);
      // 반환된 데이터 중 첫 번째 동영상만 저장
      if (videoResponse.data.data && videoResponse.data.data.length > 0) {
        setVideos([videoResponse.data.data[0]]);
      } else {
        setVideos([]); // 동영상이 없으면 빈 배열로 설정
      }
    } catch (error) {
      console.error('동영상 데이터 가져오기 실패:', error);
      setVideos([]); // 에러 발생 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="m_detail-container-unique">
      <div className="m_detail-filter-unique">
        <table className="filter-table">
          <tbody>
            <tr>
              <td>차량번호:</td>
              <td>{violation ? violation.violation_number : carNumber}</td>
            </tr>
            <tr>
              <td>선택된 날짜:</td>
              <td>
                {startDate && endDate
                  ? `${formatDate(startDate)} ~ ${formatDate(endDate)}`
                  : date
                    ? formatDate(date)
                    : "선택한 날짜가 없습니다."}
              </td>
            </tr>
            <tr>
              <td>조회 기간:</td>
              <td>
                {startDate && endDate
                  ? `${formatDate(startDate)} ~ ${formatDate(endDate)}`
                  : date
                    ? formatDate(date)
                    : "선택한 날짜가 없습니다."}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 사진 박스 추가 */}
      {/* <div className="m_detail-photo-unique">
        <div className="m_detail-photo-box-unique">사진</div>
      </div>   */}

      {/* 동영상 표시 영역 */}
      <div className="m_detail-photo-box-unique">
        {loading ? (
          <div className="m_detail-loading">동영상을 불러오는 중입니다...</div>
        ) : (
          <>
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <div key={index} className="m_detail-video-container">
                  {/* 동영상 */}
                  <video
                    controls
                    src={video.url}
                    className="m_detail-video"
                  ></video>
                </div>
              ))
            ) : (
              <div className="m_detail-placeholder">원하는 데이터를 클릭하시면 <br />영상이 재생됩니다.</div>
            )}
          </>
        )}
      </div>



      <div className="m_detail-violation-unique">
        <table className="violation-table">
          <thead>
            <tr>
              <th>위반차량</th>
              <th>위반날짜</th>
              <th>위반시간</th>
              <th>위반장소</th>
            </tr>
          </thead>
          <tbody>
            {violations.length > 0 ? (
              violations.map((violation, index) => (
                <tr key={index}>
                  <td
                    onClick={() => handleCarSelection(violation.violation_number, violation.upload_time)}
                    style={{ cursor: 'pointer', color: 'blue' }}
                  >
                    {violation.violation_number}
                  </td>
                  <td>{formatDate(violation.upload_time)}</td>
                  <td>{formatTime(violation.upload_time)}</td>
                  <td>{violation.violation_location || '장소 정보 없음'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">위반 내역이 없습니다.</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* PDF 및 동영상 다운로드 버튼 */}
      <div className="m_detail-download-buttons">
        <PDFDownloadLink
          document={<PDF_form data={Array.isArray(violations) ? violations : []} />}
          fileName="Violation_Report.pdf"
        >
          {({ loading: pdfLoading }) =>
            pdfLoading ? 'PDF 생성 중...' : <button className="m_detail-download-button">PDF 다운로드</button>
          }
        </PDFDownloadLink>

        <button className="m_detail-download-button" onClick={handleVideoDownload}>동영상 다운로드</button>
      </div>
    </div>
  );
};

export default M_detail;
