import React from 'react'
import '../index.css';
import { useNavigate } from 'react-router-dom';
import ParkingList_Item from '../components/ParkingList_Item';

const ParkingList = () => {

  const navigate = useNavigate();

  const parkingData = [
    { number: 1, address: '주차장 주소 나타내는 부분 1' },
    { number: 2, address: '주차장 주소 나타내는 부분 2' },
    { number: 3, address: '주차장 주소 나타내는 부분 3' },
    { number: 4, address: '주차장 주소 나타내는 부분 4' },
    { number: 5, address: '주차장 주소 나타내는 부분 5' },
    { number: 6, address: '주차장 주소 나타내는 부분 6' },
    { number: 7, address: '주차장 주소 나타내는 부분 7' },
    { number: 8, address: '주차장 주소 나타내는 부분 8' },
  ];

  const parkingMove = () => {
    navigate('/Myparking_place')
  }

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
          onAddressClick={parkingMove}
        />
      ))}
    </div>
  )
}

export default ParkingList