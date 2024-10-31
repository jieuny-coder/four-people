import React, { useState, useEffect, useCallback } from 'react';
import { Map, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import useKakaoLoader from './useKakaoLoder';

const ParkingMa = ({ searchTerm }) => {
    useKakaoLoader();

    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);

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

    if (!window.kakao) {
        return <div>Loading...</div>;
    }

    return (
        <div className="map-container">
            <Map
                id="map"
                center={{ lat: 35.147290, lng: 126.922347 }}
                style={{ width: "100%", height: "100%" }}
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
                <div className="selected-place">
                    <div>{selectedPlace.name}</div>
                    <div>{selectedPlace.address}</div>
                </div>
            )}
        </div>
    );
};

export default ParkingMa;
