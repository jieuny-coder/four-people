import React from 'react'
import LineBox from '../components/LineBox';

const ManagerFilterpage = () => {
    return (
        <div className="filter-page-container">
            {/* 차량 번호 입력 */}
            <div className="vehicle-input-section">
                <div className="vehicle-input-label">차량번호</div>
                <div className="vehicle-input-box">
                    <input type="text" placeholder="차량 번호를 입력하세요." />
                </div>
            </div>

            {/* 조회 시간 선택 */}
            <div className="query-time-section">
                <div className="query-time-label">조회시간</div>
                <div className="query-time-buttons">
                    <LineBox label="6시간" />
                    <LineBox label="12시간" />
                    <LineBox label="24시간" />
                </div>
                <div className="query-order-buttons">
                    <LineBox customClass='box_len' label="최신순" />
                    <LineBox customClass='box_len' label="과거순" />
                </div>
            </div>

            {/* 시간 조회 */}
            <div className="time-query-section">
                <div className="time-query-label">시간 조회</div>
                <div className="time-query-inputs">
                    <input type="text" placeholder="시작 시간" />
                    <span>~</span>
                    <input type="text" placeholder="종료 시간" />
                </div>
            </div>

            {/* 조회하기 버튼 */}
            <div className="submit-button-section">
                <button className="submit-button">조회하기</button>
            </div>
        </div>
    );
}

export default ManagerFilterpage