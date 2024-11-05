import React from 'react'

const Handicap_car = () => {
    return (
        <div className="handicap_car_container">
          <div className="handicap_car_content">
            <p>반갑습니다. 관리자님!</p>
            <p>장애인 등록이 확인된 차량에는 등록 버튼을 눌러주세요.</p>
    
            <div className="search_section">
              <input type="text" placeholder="조회할 차량 번호를 입력하세요." />
              <button className="search_button">조회하기</button>
            </div>
    
            <div className="car_list_section">
              <div className="car_list_header">
                <span>가입날짜</span>
                <span>차량번호</span>
                <span>이름</span>
                <span>연락처</span>
                <button>등록</button>
              </div>
              {/* 차량 데이터가 여기에 동적으로 추가될 수 있습니다 */}
            </div>
          </div>
        </div>
      );
    };

export default Handicap_car