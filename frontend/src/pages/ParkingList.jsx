import React, { useEffect, useState } from 'react'
import '../index.css';
import { useNavigate } from 'react-router-dom';
import ParkingList_Item from '../components/ParkingList_Item';

const ParkingList = () => {
  const [id,setId] = useState();

  const navigate = useNavigate();

  useEffect(()=>{
    setId(sessionStorage.getItem('id'))
  },[])

  const parkingData = [
    { number: 1, address: '주차장 주소 나타내는 부분 1',latitude: 37.5665, longitude: 126.978  },
    { number: 2, address: '주차장 주소 나타내는 부분 2' },
    { number: 3, address: '주차장 주소 나타내는 부분 3' },
    { number: 4, address: '주차장 주소 나타내는 부분 4' },
    { number: 5, address: '주차장 주소 나타내는 부분 5' },
    { number: 6, address: '주차장 주소 나타내는 부분 6' },
    { number: 7, address: '주차장 주소 나타내는 부분 7' },
    { number: 8, address: '주차장 주소 나타내는 부분 8' },
  ];


  const parkingMove = (latitude,longitude) => {
    navigate('/Myparking_place',{state:{latitude,longitude}}); // 위도 경도 전달
  };

  

  return (
    <div className="parking_list_container">
      <div className="parking_list_header">
        <div className="parking_list_header_number">번호</div>
        <p className="parking_list_header_address">주소</p>
      </div>
      <hr />
      {parkingData.map((item) => (
        <ParkingList_Item
          key={item.number}
          number={item.number}
          address={item.address}
          onAddressClick={()=>parkingMove(item.latitude,item.longitude, item.address)} // 클릭시 이동
        />
      ))}
    </div>
  )
}

export default ParkingList