import React from 'react'
import Topbar from '../components/Topbar'
import Header from '../components/Header'
import Btnbar from '../components/Btnbar'

const SearchFilter = () => {
  return (
    <div>
      <div className="screen-container">
        <img className="screen-replace" src="/images/mobile.png" alt="iPhone Frame" />
        {/* 추가 UI 요소들을 className이 content인 div안에 배치하면 됩니다 */}
          <Topbar />
          <Header/>
          <div className='content'>
            여기에 내용입력
          </div>
          <Btnbar/>
      </div>
    </div>
  )
}

export default SearchFilter