import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const U_login = ({ setIsAdmin }) => {
    const [isUser, setIsUser] = useState(true); 
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        id: '',
        pw: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setLoginData({
            ...loginData,
            [id]: value
        });
    };

    const handleTabSwitch = (type) => {
        console.log(`${type} 버튼이 클릭되었습니다.`);
        setIsUser(type === 'user');
    };

    const handleLoginClick = async () => {
        console.log('로그인 버튼이 클릭되었습니다.');
        if (isUser) {
            try {
                const response = await axios.post('http://localhost:4000/user/U_login', loginData);
                
                if (response.data.result === 'success') {
                    setIsAdmin(false); 
                    navigate('/userMain');
                } else {
                    alert('로그인 실패: 아이디 또는 비밀번호가 올바르지 않습니다.');
                }
            } catch (error) {
                console.error('로그인 요청 중 오류 발생:', error);
                alert('로그인 요청 중 오류가 발생했습니다.');
            }
        } else {
            setIsAdmin(true); 
            navigate('/M_calender'); 
        }
    };

    const handleRegisterClick = () => {
        navigate('/join');
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
                    <input 
                        type="text" 
                        id="id" 
                        value={loginData.id} 
                        onChange={handleChange} 
                        placeholder={isUser ? "아이디를 입력하세요." : "관리자 아이디를 입력하세요."} 
                    />
                    <input 
                        type="password" 
                        id="pw" 
                        value={loginData.pw} 
                        onChange={handleChange} 
                        placeholder={isUser ? "비밀번호를 입력하세요." : "관리자 비밀번호를 입력하세요."} 
                    />
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
