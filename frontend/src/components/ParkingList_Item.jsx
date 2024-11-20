import React, { useState, useEffect } from 'react';

const ParkingList_Item = ({ number, address, onAddressClick, parkingId }) => {
  // 로컬 저장소에서 해당 아이템에 대한 즐겨찾기 상태를 가져옴
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // parkingId를 사용하여 로컬 저장소에서 즐겨찾기 상태를 가져옵니다.
    const savedFavorite = localStorage.getItem(`favorite_${parkingId}`);
    if (savedFavorite === 'true') {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [parkingId]); // parkingId가 변경될 때마다 상태를 업데이트

  // 즐겨찾기 상태를 변경하는 함수
  const toggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);

    // 로컬 저장소에 변경된 상태를 저장
    localStorage.setItem(`favorite_${parkingId}`, newFavoriteStatus.toString());
  };

  return (
    <div className="parking_item_container">
      <span className="parking_item_number">{number}</span>
      <div className="parking_item_address" onClick={onAddressClick}>{address}</div>
      <img
        className={`parking_item_star_icon ${isFavorite ? 'favorite' : ''}`}
        alt="star"
        src={isFavorite ? 'images/fill_star.png' : 'images/star_.png'}
        onClick={toggleFavorite}
      />
    </div>
  );
}

export default ParkingList_Item;
