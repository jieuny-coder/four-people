import React, { useState } from 'react';

const U_login = () => {
    const [isUser, setIsUser] = useState(true);  // 기본적으로 사용자 버튼이 활성화됨

    const handleTabSwitch = (type) => {
        console.log(`${type} 버튼이 클릭되었습니다.`);  // 버튼 클릭 시 콘솔에 출력
        setIsUser(type === 'user');  // 'user' 클릭 시 true, 'admin' 클릭 시 false
    };

    const handleLoginClick = () => {
        console.log('로그인 버튼이 클릭되었습니다.');
        // 로그인 클릭 시 필요한 동작을 여기에 추가
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
                    <button className="login_button" onClick={handleLoginClick}>로그인</button> {/* 로그인 버튼 클릭 시 콘솔 출력 */}
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
