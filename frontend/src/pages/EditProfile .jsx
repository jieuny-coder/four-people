import React, { useState } from 'react';

const EditProfile = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
    } else {
      setErrorMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 수정 처리 로직 추가
  };

  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit}>
        <div className="edit-profile-label">이름</div>
        <input type="text" placeholder="이름을 입력해 주세요" className="edit-profile-input-large" required />

        <div className="edit-profile-label">비밀번호
          <span className="edit-profile-error-text">20자 이내의 비밀번호를 입력해주세요.</span>
        </div>
        <div className="edit-profile-password-container">
          <input
            type="password"
            placeholder="비밀번호 입력(문자,숫자,특수문자 포함 8-20자)"
            className="edit-profile-input-large"
            required
            onChange={handlePasswordChange}
          />
        </div>

        <div className="edit-profile-label">비밀번호 확인

          <span className="edit-profile-error-text">{errorMessage}</span>
        </div>
        <input type="password" placeholder="비밀번호 재입력" className="edit-profile-input-large" required onChange={handleConfirmPasswordChange} />

        <div className="edit-profile-label">차량번호</div>
        <input type="text" placeholder="차량 번호를 입력하세요." className="edit-profile-input-large" required />

        <div className="edit-profile-label">전화번호</div>
        <input type="tel" placeholder="휴대폰 번호 입력(-제외 11자리 입력)" className="edit-profile-input-large" required />

        <div className="edit-profile-label">이메일 주소</div>
        <div className="edit-profile-email-container">
          <input type="text" placeholder="이메일 주소" className="edit-profile-input-small" required />
          <span className="edit-profile-email-icon">@</span>
          <input type="text" placeholder="gmail.com" className="edit-profile-input-small" required />
        </div>

        <button type="submit" className="edit-profile-submit-button">수정하기</button>
      </form>
    </div>
  );
};

export default EditProfile;
