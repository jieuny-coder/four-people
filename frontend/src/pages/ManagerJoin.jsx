import React from 'react';
import InputBox from '../components/InputBox';
import BTN from '../components/BTN'; // 검정색 버튼 컴포넌트

const ManagerJoin = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 서버로 데이터를 제출하는 로직만들기
    console.log('Form submitted');
  };

  return (
    <div className="manager-signup-page-container">
      {/* 배경 이미지 */}
      <img
        className="manager-signup-background"
        alt="배경"
        src="/images/background.png"
      />

      {/* Form 태그 추가 */}
      <form className="manager-signup-form-container" onSubmit={handleSubmit}>
        {/* 아이디 입력 */}
        <div className="manager-signup-form-field">
          <div className="manager-signup-label-error-container">
            <label className="manager-signup-form-label">아이디</label>
            <div className="manager-signup-error-text">
              사용할 수 없는 아이디 입니다.
            </div>
          </div>
          <div className="manager-signup-input-button-container">
            {/* InputBox와 BTN 컴포넌트 사이즈 조절 */}
            <InputBox
              className="custom-input-size"
              label="아이디를 입력(6-20자)"
              placeholder="아이디를 입력하세요."
            />
            <BTN className="custom-btn-size" label="중복확인" />
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div className="manager-signup-form-field">
          <div className="manager-signup-label-error-container">
            <label className="manager-signup-form-label">비밀번호</label>
            <div className="manager-signup-error-text">
              20자 이내의 비밀번호를 입력해주세요.
            </div>
          </div>
          <InputBox
            className="custom-input-size"
            label="비밀번호 입력(문자,숫자,특수문자 포함 8-20자)"
            placeholder="비밀번호를 입력하세요."
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="manager-signup-form-field">
          <div className="manager-signup-label-error-container">
            <label className="manager-signup-form-label">비밀번호 확인</label>
            <div className="manager-signup-error-text">
              비밀번호가 일치하지 않습니다.
            </div>
          </div>
          <InputBox
            className="custom-input-size"
            label="비밀번호 재입력"
            placeholder="비밀번호를 다시 입력하세요."
          />
        </div>

        {/* 이름 입력 */}
        <div className="manager-signup-form-field">
          <label className="manager-signup-form-label">이름</label>
          <InputBox
            className="custom-input-size"
            label="이름을 입력해주세요."
            placeholder="이름을 입력하세요."
          />
        </div>

        {/* 전화번호 입력 */}
        <div className="manager-signup-form-field">
          <label className="manager-signup-form-label">전화번호</label>
          <InputBox
            className="custom-input-size"
            label="휴대폰 번호 입력(‘-’제외 11자리 입력)"
            placeholder="전화번호를 입력하세요."
          />
        </div>

        {/* 이메일 주소 입력 */}
        <div className="manager-signup-form-field">
          <label className="manager-signup-form-label">이메일 주소</label>
          <div className="manager-email-input-container">
            <InputBox
              className="manager-signup-input"
              label="이메일 주소"
              placeholder="이메일 주소를 입력하세요."
            />
            <span className="manager-email-separator">@</span>
            <InputBox
              className="manager-signup-input"
              label="gmail.com"
              placeholder="gmail.com"
            />
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <div className="manager-signup-button-container">
          <button type="submit" className="black-button">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManagerJoin;
