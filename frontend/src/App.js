import './App.css';
import Header from './components/Header';
import U_login from './pages/U_login';
import BannerBox from './components/BannerBox';
import Download from './pages/Download';


function App() {
  return (

    <div className="mobile_frame">
      {/* 휴대폰 프레임 이미지 */}
      <img className="mobile_frame_img" src="/images/mobile.png" alt="iPhone Frame" />
      <div
        className="mobile_content"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.png)` }}
      >
        {/* Header 컴포넌트 추가 */}
        <Header/>
        {/* BannerBox 컴포넌트 추가 - Header 바로 아래에 위치 */}
        {/* <BannerBox/> */}
        {/* 이곳에 콘텐츠 추가 */}
        <U_login/>
        {/* <Download/> */}
      </div>
    </div>
  );
}

export default App;
