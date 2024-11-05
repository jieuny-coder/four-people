import React, { useState, useEffect, useCallback } from 'react';
import { Map, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import useKakaoLoader from './useKakaoLoder';
import axios from 'axios';

const ParkingMa = ({ searchTerm }) => {
    useKakaoLoader();

    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    // const [latitude, setLatitude] = useState(35.147396); // 초기값 설정
    // const [longitude, setLongitude] = useState(126.922090); // 초기값 설정

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

    // useEffect(() => {
    //     const fetchLocationData = async () => {
    //         try {
    //             const response = await axios.get('');
    //             console.log('API 응답:', response.data); // 응답 데이터 확인
    //             setLatitude(response.data.documents[0].address.y);
    //             setLongitude(response.data.documents[0].address.x);
    //         } catch (error) {
    //             console.error('위치 데이터를 가져오는 데 실패했습니다:', error.response ? error.response.data : error.message);
    //         }
    //     };
    
    //     fetchLocationData();
    // }, []);
    

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
                center={{ lat: 35.146738, lng: 126.922251 }}
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
        </div>
    );
};

export default ParkingMa;
