import React from 'react';
import { useState } from 'react';

const ParkingList_Item = ({ number, address, onAddressClick }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

  return (
    <div className="parking_item_container">
      <span className="parking_item_number">{number}</span>
      <div className="parking_item_address" onClick={onAddressClick}>{address}</div>
      <img
        className={`parking_item_star_icon ${isFavorite ? 'favorite' : ''}`}
        alt="star"
        src="images/stars.png"
        onClick={toggleFavorite}
      />
    </div>
  );
}

export default ParkingList_Item
