import React from 'react'


const Home = () => {
    return (
        <div className="screen-container">
            <img className="screen-replace" src="/images/mobile.png" alt="iPhone Frame" />
            {/* 추가 UI 요소들을 이곳에 배치하면 됩니다 */}
            <div className='content'>
                <p>안녕하소</p>
            </div>
        </div>
    )
}

export default Home