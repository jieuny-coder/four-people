import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate를 사용하여 페이지 이동 설정

const ViolationsList = ({ data = [] }) => { // 데이터가 없으면 빈 배열로 초기화
  const navigate = useNavigate();

  // 특정 위반 내역을 클릭하면 상세 페이지로 이동하는 함수
  const handleRowClick = (violation) => {
    navigate(`/detail`, { state: { violation } }); // M_detail로 이동하며 state로 violation 데이터 전달
  };

  return (
    <div className="violations-list-container">
      {/* 컬럼 제목 추가 */}
      {data.length > 0 && ( // 데이터가 있을 때만 렌더링
        <div className="violation-header">
          <div className="violation-cell-header">날짜</div>
          <div className="violation-cell-header">차량번호</div>
          <div className="violation-cell-header">장소</div>
          <div className="violation-cell-header">주차시간</div>
          <div className="violation-cell-header">이용구역</div>
        </div>
      )}

      {/* 데이터 목록 */}
      {data.length > 0 ? ( 
        data.map((violation, index) => (
          <div
            key={index}
            className="violation-row"
            onClick={() => handleRowClick(violation)} // 클릭 이벤트 설정
          >
            <div className="violation-cell">{violation.날짜}</div>
            <div className="violation-cell">{violation.차량번호}</div>
            <div className="violation-cell">{violation.장소}</div>
            <div className="violation-cell">{violation.주차시간}</div>
            <div className="violation-cell">{violation.이용구역}</div>
          </div>
        ))
      ) : (
        <p>위반 내역이 없습니다.</p> // 데이터가 없을 경우 표시
      )}
    </div>
  );
};

export default ViolationsList;
