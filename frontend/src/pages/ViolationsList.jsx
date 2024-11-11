import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';


const ViolationsList = () => {
  const navigate = useNavigate();
  const [violations, setViolations] = useState([]); //  DB에서 가져온 데이터를 저장할 상태 
  const [loading, setLoading] = useState(true); 
  const [error,setError] = useState('') // 에러를 표시


  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const response = await axios.get('http://localhost:4000/violation/all', {
          withCredentials: true
        });
        // null이나 undefined가 아닌 데이터를 필터링하여 상태에 저장
        const validData = response.data.filter(violation => violation.violation_date);
        setViolations(validData);
        setLoading(false);
      } catch (error) {
        console.error('서버 오류:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };
  
    fetchViolations();
  }, []);
   // 컴포넌트가 마운트될 때 한 번 실행

  const handleRowClick = (violation) => {
    navigate(`/detail`, { state: { violation } });
  };

  const handleDownloadPageNavigation = () => {
    navigate(`/download`, { state: { previewData: violations } });
  };

  // if (loading){
  //   return<p>로딩 중.....</p>
  // }

  if (error) {
    return<p style={{ color:'red' }}>{error}</p>
  }

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
  

  return (
    <div className="violations-list-container">
      {/* 컬럼 제목 */}
      <div className="violation-header">
        <div className="violation-cell-header">날짜</div>
        <div className="violation-cell-header">차량번호</div>
        <div className="violation-cell-header">장소</div>
        <div className="violation-cell-header">주차시간</div>
        <div className="violation-cell-header">이용구역</div>
      </div>

      {/* 데이터 목록 또는 "위반 내역이 없습니다." 메시지 */}
      {violations.length > 0 ? (
        violations.map((violation, index) => (
          <div
            key={index}
            className="violation-row"
            onClick={() => handleRowClick(violation)}
            style={{ cursor: 'pointer' }}
          >
            <div className="violation-cell">{formatDate(violation.violation_date)}</div>
            <div className="violation-cell">{violation.violation_number}</div>
            <div className="violation-cell">{violation.violation_location}</div>
            <div className="violation-cell">{violation.violation_time}</div>
            <div className="violation-cell">{violation.violation_section}</div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', padding: '20px', color: 'gray' }}>
          위반 내역이 없습니다.
        </p>
      )}
      
      {/* 다운로드 페이지로 이동하는 버튼 */}
      <button className="to_download" onClick={handleDownloadPageNavigation}>
        다운로드페이지로
      </button>
    </div>
  );
};

export default ViolationsList;
