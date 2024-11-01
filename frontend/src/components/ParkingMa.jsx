import React, { useState, useEffect, useCallback } from 'react';
import { Map, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import useKakaoLoader from './useKakaoLoder';

const ParkingMa = ({ searchTerm }) => {
    useKakaoLoader();

    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);

    const addToFavorites = (name, address) => {
        setFavorites([...favorites, { name, address }]);
        alert(`${name}이(가) 즐겨찾기에 추가되었습니다.`);
    };

    const displayPlaces = useCallback((places) => {
        if (!map) return;

        const bounds = new window.kakao.maps.LatLngBounds();
        const newMarkers = [];

        places.forEach((place) => {
            const position = new window.kakao.maps.LatLng(place.y, place.x);
            const marker = new window.kakao.maps.Marker({
                position: position,
                map: map
            });

            newMarkers.push({
                position,
                content: place.place_name,
                address: place.road_address || place.address_name
            });

            window.kakao.maps.event.addListener(marker, 'click', function() {
                setSelectedPlace({
                    name: place.place_name,
                    address: place.road_address || place.address_name,
                    marker
                });
            });

            bounds.extend(position);
        });

        setMarkers(newMarkers);
        map.setBounds(bounds);
    }, [map]);

    useEffect(() => {
        if (!map || !searchTerm) return;

        const ps = new window.kakao.maps.services.Places();
        ps.keywordSearch(searchTerm, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                displayPlaces(data);
            } else {
                console.error('검색 실패', status);
            }
        });
    }, [map, searchTerm, displayPlaces]);

    const handleAddToFavorites = () => {
        if (selectedPlace) {
            addToFavorites(selectedPlace.name, selectedPlace.address);
            setSelectedPlace(null); // 선택된 장소 초기화
        }
    };

    if (!window.kakao) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Map
                id="map"
                center={{ lat: 35.147290, lng: 126.922347 }}
                style={{ width: "380px", height: "300px" }}
                level={3}
                onCreate={setMap}
            >
                <MapTypeControl position={"TOPRIGHT"} />
                <ZoomControl position={"RIGHT"} />
                {markers.map((marker, index) => (
                    <MapMarker
                        key={`marker-${index}`}
                        position={marker.position}
                        title={marker.content}
                        onClick={() => {
                            setSelectedPlace({
                                name: marker.content,
                                address: marker.address
                            });
                        }}
                    />
                ))}
            </Map>

            {selectedPlace && (
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: '#fff', padding: '10px', borderRadius: '5px' }}>
                    <div>{selectedPlace.name}</div>
                    <div>{selectedPlace.address}</div>
                    <button onClick={handleAddToFavorites}>즐겨찾기 추가</button>
                    <button onClick={() => setSelectedPlace(null)}>닫기</button>
                </div>
            )}

            <div className='map_list'>
                <h3>즐겨찾기 목록</h3>
                <ul>
                    {favorites.map((favorite, index) => (
                        <li key={index}>
                            {favorite.name} - {favorite.address}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ParkingMa;
