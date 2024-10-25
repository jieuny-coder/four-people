import React from 'react';

const M_detail = () => {
  // 기본적으로 위반 내역에 하나의 데이터가 있는 상태
  const violations = ['위반내역 1']; // 임의의 위반 내역 데이터 추가

  return (
    <div className="m_detail-container-unique">
      {/* 필터링 조건 */}
      <div className="m_detail-filter-unique">
        <button className="m_detail-filter-btn-unique">필터링 조건 보여주는 부분</button>
      </div>

      {/* 사진 표시 영역 */}
      <div className="m_detail-photo-unique">
        <div className="m_detail-photo-box-unique">사진</div>
      </div>

      {/* 위반 내역을 동적으로 생성 */}
      <div className="m_detail-violation-unique">
        {violations.length > 0 ? (
          violations.map((violation, index) => (
            <div key={index} className="m_detail-violation-row-unique">{violation}</div>
          ))
        ) : (
          null // 위반 내역이 없을 때는 아무것도 표시하지 않음
        )}
      </div>
    </div>
  );
};

export default M_detail;
