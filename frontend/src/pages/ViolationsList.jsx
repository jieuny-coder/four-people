import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동 설정을 위해 useNavigate 사용

const ViolationsList = () => {
  const navigate = useNavigate();

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

  // 특정 위반 내역을 클릭 시 상세 페이지로 이동
  const handleRowClick = (violation) => {
    navigate(`/detail`, { state: { violation } });
  };

  return (
    <div className="violations-list-container">
      {/* 컬럼 제목 */}
      {exampleData.length > 0 && (
        <div className="violation-header">
          <div className="violation-cell-header">날짜</div>
          <div className="violation-cell-header">차량번호</div>
          <div className="violation-cell-header">장소</div>
          <div className="violation-cell-header">주차시간</div>
          <div className="violation-cell-header">이용구역</div>
        </div>
      )}

      {/* 데이터 목록 */}
      {exampleData.length > 0 ? (
        exampleData.map((violation, index) => (
          <div
            key={index}
            className="violation-row"
            onClick={() => handleRowClick(violation)}
            style={{ cursor: 'pointer' }} // 커서 모양을 손가락으로 변경
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
    </div>
  );
};

export default ViolationsList;
