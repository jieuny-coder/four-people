import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer'; // PDFDownloadLink 임포트
import PDF_form from '../components/PDF_form'; // PDF_form 컴포넌트 임포트

const M_detail = () => {
  const location = useLocation();
  const { violation } = location.state || {}; // ViolationsList에서 전달된 데이터 (state)

  // URL 파라미터 처리
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get('date'); // 달력에서 선택한 날짜
  const startDate = queryParams.get('start'); // 조회 시작 날짜 (직접 설정된 시간)
  const endDate = queryParams.get('end'); // 조회 종료 날짜 (직접 설정된 시간)
  const carNumber = queryParams.get('carNumber'); // 차량 번호
  const selectedTime = queryParams.get('selectedTime'); // 조회 시간 (6시간, 12시간, 24시간)

  const [violations, setViolations] = useState(violation ? [violation] : []); // 초기 상태에 violation 설정
  const [loading, setLoading] = useState(!violation); // violation이 없으면 로딩 중 표시

  let startTimeDisplay = startDate;
  let endTimeDisplay = endDate;

  // 날짜 형식을 YYYY-MM-DD로 변환하는 함수
  const formatDate = (isoDate) => {
    if (!isoDate) {
      return '날짜 없음';
    }
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return '유효하지 않은 날짜';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 선택된 날짜를 기준으로 시작 시간과 종료 시간을 설정
  if (selectedTime) {
    const selectedDateTime = new Date(date);
    const now = new Date();
    selectedDateTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    const start = new Date(selectedDateTime);

    if (selectedTime === '6시간') {
      start.setHours(start.getHours() - 6);
    } else if (selectedTime === '12시간') {
      start.setHours(start.getHours() - 12);
    } else if (selectedTime === '24시간') {
      start.setHours(start.getHours() - 24);
    }

    const formatDateTime = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    startTimeDisplay = formatDateTime(start);
    endTimeDisplay = formatDateTime(selectedDateTime);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (startDate && endDate) {
          response = await axios.get('http://localhost:4000/violation/filtering_dateRange', {
            params: {
              startDate: `${startDate} 00:00:00`,
              endDate: `${endDate} 23:59:59`
            }
          });
        } else if (date && carNumber && startTimeDisplay && endTimeDisplay) {
          response = await axios.get('http://localhost:4000/violation/filter_Violations', {
            params: {
              car_number: carNumber,
              startTime: startTimeDisplay,
              endTime: endTimeDisplay
            }
          });
        } else {
          setLoading(false);
          return;
        }

        // 로그 추가: 데이터가 제대로 반환되는지 확인
        console.log('Fetched violations:', response.data);

        setViolations(response.data);
      } catch (error) {
        console.error('위반데이터 패치 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (violation || carNumber || (startDate && endDate)) {
      fetchData();
    }
  }, [violation, date, carNumber, startTimeDisplay, endTimeDisplay, startDate, endDate]);

  // if (loading) {
  //   return <p>로딩 중...</p>;
  // }

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
              <td>{violation ? formatDate(violation.violation_date) : formatDate(date)}</td>
            </tr>
            <tr>
              <td>조회 기간:</td>
              <td>{violation ? formatDate(violation.violation_date) : `${formatDate(startTimeDisplay)} ~ ${formatDate(endTimeDisplay)}`}<br />({selectedTime})</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="m_detail-photo-unique">
        <div className="m_detail-photo-box-unique">사진</div>
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
                  <td>{violation.violation_number}</td>
                  <td>{formatDate(violation.violation_date)}</td>
                  <td>{violation.violation_time}</td>
                  <td>{violation.violation_location}</td>
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
      <div className="m_detail-download-buttons">
        <PDFDownloadLink
          document={<PDF_form data={violations} />}
          fileName="Violation_Report.pdf"
        >
          {({ loading: pdfLoading }) =>
            pdfLoading ? (
              'PDF 생성 중...'
            ) : (
              <button className="m_detail-download-button">PDF 다운로드</button>
            )
          }
        </PDFDownloadLink>

        <button className="m_detail-download-button">동영상 다운로드</button>
      </div>


    </div>
  );
};

export default M_detail;
