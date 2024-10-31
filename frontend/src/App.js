// App.js
import './App.css';
import Header from './components/Header';
import U_login from './pages/U_login';
import Join from './pages/Join';
import BannerBox from './components/BannerBox';
import Download from './pages/Download';
import M_btnBar from './components/M_btnBar';
import Filtering from './pages/Filtering';
import Setting from './pages/Setting';
import M_calender from './pages/M_calender';
import Main from './pages/Main';
import ViolationsList from './pages/ViolationsList';
import M_detail from './pages/M_detail';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Parkinglot01 } from './pages/Parkinglot01';
import Parkinglot02 from './pages/Parkinglot02';
import { Parkinglot03 } from './pages/Parkinglot03';
import { Parkinglot04 } from './pages/Parkinglot04';
import { Parkinglot05 } from './pages/Parkinglot05';
import ParkingMa from './components/ParkingMa';

function AppContent() {
  const location = useLocation();
  const [violationsData, setViolationsData] = useState([]);
  const [detailData, setDetailData] = useState([]);

  // 현재 경로에 따라 페이지 이름 설정
  const getPageTitle = (pathname) => {
    console.log("Checking path:", pathname); // 현재 경로 확인용

    switch (pathname) {
      case '/join': return '회원가입';
      case '/filtering': return '원하는 검색 조건을 입력하세요.';
      case '/setting': return '설정';
      case '/download': return 'Download';
      case '/M_calender': return 'Manager Main';
      case '/Violations': return '위반 차량 목록';
      case '/detail': return '상세 정보';
      default: return '페이지 제목 없음'; // 디폴트 제목 추가
    }
};

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="mobile_frame">
      <img className="mobile_frame_img" src="/images/mobile.png" alt="iPhone Frame" />
      <div
        className="mobile_content"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.png)` }}
      >
        {/* Main, Login 페이지를 제외한 모든 페이지에서 Header와 BannerBox 렌더링 */}
        {location.pathname !== '/' && location.pathname !== '/login' && <Header title={pageTitle} />}
        {location.pathname !== '/' && location.pathname !== '/login' && <BannerBox />}

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<U_login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/filtering" element={<Filtering />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/download" element={<Download />} />
          <Route path="/m_calender" element={<M_calender />} />
          <Route path="/violations" element={<ViolationsList />} />
          <Route path="/detail" element={<M_detail />} />
          <Route path="/Parkinglot01" element={<Parkinglot01 />} />
          <Route path="/parkinglot02" element={<Parkinglot02 />} />
          <Route path="/parkinglot03" element={<><ParkingMa /><Parkinglot03 /></>} />
          <Route path="/Parkinglot04" element={<Parkinglot04 />} />
          <Route path="/parkinglot05" element={<Parkinglot05 />} />
        </Routes>

        {location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/join' &&
          <M_btnBar violationsData={violationsData} detailData={detailData} />
        }
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
