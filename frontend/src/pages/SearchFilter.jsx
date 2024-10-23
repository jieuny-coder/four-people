import React from 'react'
import Topbar from '../components/Topbar'
import Header from '../components/Header'
import Btnbar from '../components/Btnbar'
import UserLogin from './UserLogin'

const SearchFilter = () => {
  // 화면 컴포넌트 확인용 페이지


  return (
    <div>
      <div className="screen-container">
        <img className="screen-replace" src="/images/mobile.png" alt="iPhone Frame" />
        {/* Topbar 컴포넌트 고정 */}
        <Topbar />

        {/* Header 컴포넌트 */}
        <Header />

        {/* Btnbar를 프레임 하단에 고정 */}
        <Btnbar />

        {/* 페이지 컴포넌트는 필요 시 여기에 추가 */}
        <UserLogin/>
      </div>
    </div>
  )
}

export default SearchFilter