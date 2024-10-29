import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const [adminCode, setAdminCode] = useState('');
  const navigate = useNavigate();

  const handleAdminCodeChange = (e) => {
    setAdminCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 가입 처리 로직 추가
    // 가입이 성공했다는 가정 하에 로그인 페이지로 이동
    navigate('/login'); // !!!!!!!!!!!!!!!!! 로그인 페이지로 이동
  };

  return (
    <div className="join-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>아이디</label>
          <input type="text" placeholder="아이디를 입력하세요" required />
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input type="password" placeholder="비밀번호를 입력하세요" required />
        </div>

        <div className="form-group">
          <label>비밀번호 확인</label>
          <input type="password" placeholder="비밀번호를 다시 입력하세요" required />
        </div>

        <div className="form-group">
          <label>이름</label>
          <input type="text" placeholder="이름을 입력하세요" required />
        </div>

        <div className="form-group">
          <label>전화번호</label>
          <input type="tel" placeholder="전화번호를 입력하세요" required />
        </div>

        <div className="form-group">
          <label>이메일 주소</label>
          <input type="email" placeholder="이메일을 입력하세요" required />
        </div>

        <div className="form-group">
          <label>관리자 코드 (선택 사항)</label>
          <input type="text" placeholder="관리자 인증키를 입력하세요" value={adminCode} onChange={handleAdminCodeChange} />
        </div>

        <button type="submit" className="join-button">회원가입</button>
      </form>
    </div>
  );
};

export default Join;
