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
import M_detail from './pages/M_detail'; // M_detail 컴포넌트 추가
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();

  return (
    <div className="mobile_frame">
      <img className="mobile_frame_img" src="/images/mobile.png" alt="iPhone Frame" />
      <div
        className="mobile_content"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.png)` }}
      >
        {/* Header와 BannerBox는 Main, Login 페이지를 제외한 모든 페이지에서 렌더링 */}
        {location.pathname !== '/' && location.pathname !== '/login' && <Header />}
        {location.pathname !== '/' && location.pathname !== '/login' && <BannerBox />}

        <Routes>
          <Route path="/" element={<Main />} /> {/* Main 페이지 */}
          <Route path="/login" element={<U_login />} /> {/* 로그인 페이지 */}
          <Route path="/join" element={<Join />} /> {/* 회원가입 페이지 */}
          <Route path="/filtering" element={<Filtering />} /> {/* Filtering 페이지 */}
          <Route path="/setting" element={<Setting />} /> {/* Setting 페이지 */}
          <Route path="/download" element={<Download />} /> {/* Download 페이지 */}
          <Route path="/m_calender" element={<M_calender />} /> {/* 관리자 페이지 */}
          <Route path="/violations" element={<ViolationsList />} /> {/* 위반 차량 정보 페이지 */}
          <Route path="/detail" element={<M_detail />} /> {/* M_detail 페이지 추가 */}
        </Routes>

        {/* M_btnBar는 Main, Login, Join 페이지에서는 보이지 않도록 */}
        {location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/join' && <M_btnBar />}
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
