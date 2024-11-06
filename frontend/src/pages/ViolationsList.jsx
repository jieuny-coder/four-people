import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';


const ViolationsList = () => {
  const navigate = useNavigate();
  const [violations, setViolations] = useState([]); // 저장할 곳 
  const [loading, setLoading] = useState(true); 
  const [error,setError] = useState('') // 에러를 표시

  // 예시 데이터
  const exampleData = [
    {
      날짜: '2024-10-28',
      차량번호: '49조1543',
      장소: 'ACC 주차장',
      주차시간: '2시간',
      이용구역: '장애인 구역',
    },
    {
      날짜: '2024-10-29',
      차량번호: '49라3929',
      장소: 'ACC부설 주차장',
      주차시간: '1시간 30분',
      이용구역: '일반 구역',
    },
  ];

  

  useEffect(() => {
    const fetchViolations = async () => {
      const userId = sessionStorage.getItem('user_id'); // 아이디를 가져오기 - 이쪽에 검색창을 만들어서 :id로 조회하여 이력을 검색하기
      if (!userId) {
        console.log('아이디가 없습니다.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:4000/user/Violations/${userId}`,{
          withCredentials:true // 세션 쿠키 포함 
        });
        if (response.data.result === 'success') {
          setViolations(response.data.data);
        } else {
          console.log('위반 차량 불러오는데 실패하였습니다.');
        }
      } catch (error) {
        console.error('서버 오류:', error);
      }
    };
  
    fetchViolations();
  },[]);

  const handleRowClick = (violation) => {
    navigate(`/detail`, { state: { violation } });
  };

  const handleDownloadPageNavigation = () => {
    navigate(`/download`, { state: { previewData: exampleData } });
  };

  if (loading){
    return<p>로딩 중.....</p>
  }

  if (error) {
    return<p style={{ color:'red' }}>{error}</p>
  }

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
      {exampleData.length > 0 ? (
        exampleData.map((violation, index) => (
          <div
            key={index}
            className="violation-row"
            onClick={() => handleRowClick(violation)}
            style={{ cursor: 'pointer' }}
          >
            <div className="violation-cell">{violation.날짜}</div>
            <div className="violation-cell">{violation.차량번호}</div>
            <div className="violation-cell">{violation.장소}</div>
            <div className="violation-cell">{violation.주차시간}</div>
            <div className="violation-cell">{violation.이용구역}</div>
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
