import React from 'react'
import Btnbar from '../components/Btnbar';
import '../index.css';
import BannerBox from '../components/BannerBox';
import { useNavigate } from 'react-router-dom'

const ParkingList = () => {

  const navigate = useNavigate();

  const parkingMove = () => {
    navigate('/Myparking_place')
  }

  return (
    <div className='parkinglist_container'>
      {/* css 텍스트 div 19  */}
      {/* <Btnbar/> */}
      <div className='rectangle-parent01'>
        <div className= 'numbers'>번호</div>
        <p className='div20'>주소</p>
      </div>
      <hr/>
      <div className="rectangle-parent02">
      <p className='number'>1</p>
      <div className="div19" onClick={parkingMove} >주차장 주소 나타내는 부분</div>
      <img className="icon02" alt="" src="images/stars.png" />
    </div>
    <div className="rectangle-parent03">
      <p className='number'>2</p>
      <div className="div19">주차장 주소 나타내는 부분</div>
      <img className="icon02" alt="" src="images/stars.png" />
    </div>
    <div className="rectangle-parent04">
      <p className='number'>3</p>
      <div className="div19">주차장 주소 나타내는 부분</div>
      <img className="icon02" alt="" src="images/stars.png" />
    </div>
    <div className="rectangle-parent05">
      <p className='number'>4</p>
      <div className="div19">주차장 주소 나타내는 부분</div>
      <img className="icon02" alt="" src="images/stars.png" />
    </div>
    <div className="rectangle-parent06">
      <p className='number'>5</p>
      <div className="div19">주차장 주소 나타내는 부분</div>
      <img className="icon02" alt="" src="images/stars.png" />
    </div>
    <div className="rectangle-parent07">
      <p className='number'>6</p>
      <div className="div19">주차장 주소 나타내는 부분</div>
      <img className="icon02" alt="" src="images/stars.png" />
    </div>
    <div className="rectangle-parent08">
      <p className='number'>7</p>
      <div className="div19">주차장 주소 나타내는 부분</div>
      <img className="icon02" alt="" src="images/stars.png" />
    </div>
    <div className="rectangle-parent09">
      <p className='number'>8</p>
      <div className="div19">주차장 주소 나타내는 부분</div>
      <img className="icon02" alt="" src="images/stars.png" />
    </div>

        

    </div>
  )
}

export default ParkingList