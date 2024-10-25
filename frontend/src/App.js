import './App.css';
import Header from './components/Header';
import U_login from './pages/U_login';
import BannerBox from './components/BannerBox';
import Download from './pages/Download';
import M_btnBar from './components/M_btnBar';
import Filtering from './pages/Filtering';
import Setting from './pages/Setting';
import M_calender from './pages/M_calender';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();

  return (
    <div className="mobile_frame">
      {/* 휴대폰 프레임 이미지 */}
      <img className="mobile_frame_img" src="/images/mobile.png" alt="iPhone Frame" />
      <div
        className="mobile_content"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.png)` }}
      >
        {/* Header는 항상 렌더링 */}
        <Header />
        
        {/* 설정 페이지가 아닐 때만 BannerBox 렌더링 */}
        {location.pathname !== '/setting' && <BannerBox />}

        <Routes>
          {/* 페이지 라우팅 설정 */}
          <Route path="/" element={<M_calender />} /> {/* 기본 경로 */}
          <Route path="/filtering" element={<Filtering />} /> {/* Filtering 페이지 */}
          <Route path="/setting" element={<Setting />} /> {/* Setting 페이지 */}
          <Route path="/download" element={<Download />} /> {/* Download 페이지 */}
        </Routes>

        {/* M_btnBar 컴포넌트 추가 */}
        <M_btnBar />
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
