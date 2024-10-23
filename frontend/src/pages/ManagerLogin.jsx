import React from 'react'
import { useState } from 'react';

const ManagerLogin = () => {
    const [selected, setSelected] = useState(null);
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleClick = (type) => {
        setSelected(type);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('ID:', id);
        console.log('Password:', password);
    };

    return (
        <div className="login_container">
            <img className="login_background" alt="배경" src="/images/background.png" />

            <div className="login_text_container">
                <div className="login_text">
                    <b className="login_text_bold">
                        <p>반갑습니다!</p>
                        <p>서비스 이용을 위한</p>
                        <p>본인 인증이 필요합니다.</p>
                    </b>
                </div>
            </div>

            <div className="login_selection_container">
                <div className="login_selection_box" id='userMode' onClick={() => handleClick('user')}>
                    사용자
                </div>
                <div className="login_selection_box login_option_admin" id='ManagerMode' onClick={() => handleClick('admin')}>
                    관리자
                </div>
            </div>

            <div className="login_input_wrapper">
                <form onSubmit={handleSubmit} className="login_input_container">
                    <div className="login_input_box">
                        <input
                            type="text"
                            placeholder="아이디를 입력하세요."
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                    </div>
                    <div className="login_input_box">
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="login_button">
                        <div className="login_button_text">로그인</div>
                    </button>

                    {/* 아이디/비밀번호 찾기와 회원가입을 로그인 버튼 바로 아래로 이동 */}
                    <div className="login_links_container">
                        <div className="login_link_text">아이디/비밀번호 찾기</div>
                        <div className="login_link_text">회원가입</div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManagerLogin