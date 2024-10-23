import React from 'react'
import { useState } from 'react';

const LineBox = ({ label, customClass }) => {
    // 버튼 상태 관리 (true: 노란색, false: 하얀색)
    const [isSelected, setIsSelected] = useState(false);
    // 버튼 클릭 핸들러
    const handleClick = () => {
        console.log('Button clicked'); // 클릭 로그 추가
        setIsSelected(!isSelected); // 버튼 클릭 시 선택 상태로 변경
    };

    return (
        <div className={`line-box ${customClass} ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
            <div className="line-box-label">{label}</div>
        </div>
    );
}

export default LineBox