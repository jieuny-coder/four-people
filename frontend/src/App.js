import './index.css';
import SearchFilter from './pages/SearchFilter';

function App() {
  return (
    <div>
      <SearchFilter/>
    </div>


);
// 김지은 사용하는 부분(주석처리해놓음)
// return (
//   <div>
//     <div className="screen-container">
//       <img className="screen-replace" src="/images/mobile.png" alt="iPhone Frame" />
//       {/* Topbar 컴포넌트 고정 */}
//       <Topbar />

//       {/* Header 컴포넌트 */}
//       <Header />
//       <BannerBox/>

//       {/* Btnbar를 프레임 하단에 고정 */}
//       {/* <Btnbar /> */}

//       {/* 페이지 컴포넌트는 필요 시 여기에 추가 */}
//       {/* <UserLogin/> */}
//       {/* <BTN/> */}
//       {/* <LineBox/> */}
//       {/* <ManagerFilterpage/> */}
//       <ManagerJoin/>
//     </div>
//   </div>
// )

}

export default App;
