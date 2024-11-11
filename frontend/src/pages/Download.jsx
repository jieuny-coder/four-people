import React from 'react';
import { useLocation } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDF_form from '../components/PDF_form';


// 날짜 형식을 YYYY-MM-DD로 변환하는 함수
const formatDate = (isoDate) => {
  if (!isoDate) {
    return '날짜 없음'; // null 또는 undefined일 경우 대체 텍스트
  }
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    return '유효하지 않은 날짜'; // 날짜 형식이 잘못된 경우
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // YYYY-MM-DD 형식
};


const Download = () => {
  const location = useLocation();
  const previewData = location.state?.previewData || [];

  return (
    <div className="download_container">
      <div className="download_preview">
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
                  <td>{formatDate(item.violation_date)}</td>
                  <td>{item.violation_number}</td>
                  <td>{item.violation_location}</td>
                  <td>{item.violation_time}</td>
                  <td>{item.violation_section}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>다운로드할 데이터가 없습니다.</p>
        )}
      </div>

      {previewData.length > 0 && (
        <PDFDownloadLink
          document={<PDF_form data={previewData} />}
          fileName="Violation_Report.pdf"
        >
          {({ loading }) =>
            loading ? 'PDF 생성 중...' : <button className="download_button">Download</button>
          }
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default Download;
