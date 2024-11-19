import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Btnbar from '../components/Btnbar';
import axios from 'axios';

export const Myparking_place = () => {
    const location = useLocation();
    const [parkingInfo, setParkingInfo] = useState({
        totalSpaces: 0,
        availableSpaces: 0,
        disabledSpaces: 0,
    });
    const [coordinates, setCoordinates] = useState([]);
    const [kakaoSdkLoaded, setKakaoSdkLoaded] = useState(false);
    const [address, setAddress] = useState('');

    // 쿼리 파라미터에서 위도(latitude), 경도(longitude), 주소(address) 값 가져오기
    const queryParams = new URLSearchParams(location.search);
    const latitude = queryParams.get('latitude');
    const longitude = queryParams.get('longitude');
    const addressFromQuery = queryParams.get('address');  // 주소 값 가져오기

    useEffect(() => {
        if (addressFromQuery) {
            setAddress(addressFromQuery);  // 쿼리 파라미터에서 받은 address 상태로 설정
            console.log("쿼리에서 받은 address:", addressFromQuery);  // 콘솔로 확인
        }
    }, [addressFromQuery]);

    useEffect(() => {
        if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
            initializeKakaoRoadview(parseFloat(latitude), parseFloat(longitude)); 
        } else {
            console.error('위도와 경도 정보가 유효하지 않습니다.');
        }
    }, [latitude, longitude]);

    useEffect(() => {
        const generateRandomValue = () => Math.floor(Math.random() * 30) + 1;
        const generateRandomValue1 = () => Math.floor(Math.random() * 10) + 1;
        const generateRandomValue2 = () => Math.floor(Math.random() * 7) + 1;
        setParkingInfo({
            totalSpaces: generateRandomValue(),
            availableSpaces: generateRandomValue1(),
            disabledSpaces: generateRandomValue2(),
        });
    }, []);

    const fetchParkingData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/parkingSearch/parkinglist3');
            
            // 서버에서 받은 전체 데이터를 확인
            console.log("서버에서 받은 데이터:", response.data);
            
            // response.data가 유효한지, coordinates 배열이 있는지 확인
            if (response.data && Array.isArray(response.data.coordinates) && response.data.coordinates.length > 0) {
                const firstParking = response.data.coordinates[0];
                // 첫 번째 주차장의 주소가 존재하는지 확인
                if (firstParking && firstParking.address) {
                    setAddress(firstParking.address);
                    console.log("서버에서 받은 주소:", firstParking.address);
                } else {
                    console.error("첫 번째 주차장에 주소 정보가 없습니다.");
                    setAddress("주소 정보 없음");
                }
            } else {
                console.error("coordinates 배열이 비어 있거나 존재하지 않습니다.");
                setAddress("주소 정보 없음");
            }
        } catch (error) {
            console.error('서버에서 데이터 가져오기 실패', error);
            setAddress("주소 정보 없음");
        }
    };
    useEffect(() => {
        fetchParkingData();
    }, []);

    const initializeKakaoRoadview = (latitude, longitude) => {
        if (window.kakao) {
            console.log('Kakao SDK 이미 로드됨');
            setKakaoSdkLoaded(true); 
        } else {
            const script = document.createElement('script');
            const kakaoAppKey = process.env.REACT_APP_PARKINGSERVER_API_KEY;
            script.src = `https://developers.kakao.com/sdk/js/kakao.js?appkey=${kakaoAppKey}`;
            script.async = true;
            script.onload = () => {
                if (window.kakao) {
                    console.log('Kakao SDK Loaded');
                    setKakaoSdkLoaded(true); 
                } else {
                    console.error('Kakao SDK가 로드되지 않았습니다.');
                }
            };
            script.onerror = () => {
                console.error('카카오 SDK 로드 실패');
            };
            document.body.appendChild(script);
        }
    };

    useEffect(() => {
        if (kakaoSdkLoaded && latitude && longitude) {
            const roadviewContainer = document.getElementById('roadviewContainer');
            const position = new window.kakao.maps.LatLng(parseFloat(latitude), parseFloat(longitude));

            const roadviewClient = new window.kakao.maps.RoadviewClient();
            const roadview = new window.kakao.maps.Roadview(roadviewContainer);

            roadviewClient.getNearestPanoId(position, 50, (panoId) => {
                if (panoId === null) {
                    roadviewContainer.style.display = 'none';
                } else {
                    roadviewContainer.style.display = 'block';
                    roadview.setPanoId(panoId, position);
                    roadview.relayout();
                }
            });
        }
    }, [kakaoSdkLoaded, latitude, longitude]);

    return (
        <div className="parkinglot-status-container">
            <div className="parkinglot-address-container">
                <div className="parkinglot-address">{address || "주소를 불러오는 중..."}</div>
                <img className="parkinglot-star-icon" alt="스타 아이콘" src="images/stars.png" />
            </div>
            <div id="roadviewContainer" style={{ width: '100%', height: '180px', display: 'block', top: '0px' }}></div>
            <div className="parkinglot-info-button">주차장 정보</div>
            <div className="parkinglot-info-details">
                <div className="parkinglot-info-text">총 주차 구역수: <strong>{parkingInfo.totalSpaces}</strong></div>
                <div className="parkinglot-info-text">현재 주차 가능 수: <strong>{parkingInfo.availableSpaces}</strong></div>
                <div className="parkinglot-info-text">장애인전용주차 가능 수: <strong>{parkingInfo.disabledSpaces}</strong></div>
            </div>
            <div className="parkinglot-event-button">현재 이벤트</div>
            <div className="parkinglot-event-details">
                <div className="parkinglot-event-text">이중주차:<strong></strong> </div>
                <div className="parkinglot-event-text">통행방해:<strong></strong> </div>
            </div>
            <Btnbar />
        </div>
    );
};

export default Myparking_place;
