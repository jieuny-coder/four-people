import React, { useState } from 'react';

const U_login = () => {
    const [isUser, setIsUser] = useState(true);  // 기본적으로 사용자 버튼이 활성화됨

    const handleTabSwitch = (type) => {
        console.log(type);  // 클릭한 버튼의 타입을 로그로 확인
        setIsUser(type === 'user');  // 'user' 클릭 시 true, 'admin' 클릭 시 false
        console.log("isUser 상태:", type === 'user');
    };

    return (
        <div className="login_wrapper">
            <h2 className="greeting">반갑습니다!<br />서비스 이용을 위한 <br/> 본인 인증이 필요합니다.</h2>
            
            {/* 수평선 추가 */}
            <div className="divider_line"></div>

            <div className="login_container">
                <div className="login_tabs">
                    {/* 사용자 버튼 */}
                    <button 
                        className={isUser ? 'active' : ''} 
                        onClick={() => handleTabSwitch('user')}
                    >
                        사용자
                    </button>

                    {/* 관리자 버튼 */}
                    <button 
                        className={!isUser ? 'active' : ''} 
                        onClick={() => handleTabSwitch('admin')}
                    >
                        관리자
                    </button>
                </div>

                <div className="login_form">
                    <input type="text" placeholder={isUser ? "아이디를 입력하세요." : "관리자 아이디를 입력하세요."} />
                    <input type="password" placeholder={isUser ? "비밀번호를 입력하세요." : "관리자 비밀번호를 입력하세요."} />
                    <button className="login_button">로그인</button>
                    <div className="login_options">
                        <button className="find_credentials_button">아이디/비밀번호 찾기</button>
                        <button className="register_button">회원가입</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default U_login;
