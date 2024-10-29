import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const U_login = () => {
    const [isUser, setIsUser] = useState(true);  // 기본적으로 사용자 버튼이 활성화됨
    const navigate = useNavigate();

    const handleTabSwitch = (type) => {
        console.log(`${type} 버튼이 클릭되었습니다.`);
        setIsUser(type === 'user');
    };

    const handleLoginClick = () => {
        console.log('로그인 버튼이 클릭되었습니다.');
        if (isUser) {
            navigate('/user-dashboard'); // 사용자 로그인 성공 시 이동 경로
        } else {
            navigate('/M_calender'); // 관리자 로그인 성공 시 이동 경로
        }
    };

    const handleRegisterClick = () => {
        navigate('/join'); // 회원가입 페이지로 이동
    };

    return (
        <div className="login_wrapper">
            <h2 className="greeting">반갑습니다!<br />서비스 이용을 위한 <br/> 본인 인증이 필요합니다.</h2>
            
            <div className="divider_line"></div>

            <div className="login_container">
                <div className="login_tabs">
                    <button 
                        className={isUser ? 'active' : ''} 
                        onClick={() => handleTabSwitch('user')}
                    >
                        사용자
                    </button>
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
                    <button className="login_button" onClick={handleLoginClick}>로그인</button>
                    <div className="login_options">
                        <button className="find_credentials_button">아이디/비밀번호 찾기</button>
                        <button className="register_button" onClick={handleRegisterClick}>회원가입</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default U_login;
