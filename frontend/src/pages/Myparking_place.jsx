import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Btnbar from '../components/Btnbar';
import axios from 'axios';

export const Myparking_place = () => {
    const location = useLocation();  // useLocation을 사용하여 URL 정보 가져오기
    const [parkingInfo, setParkingInfo] = useState({
        totalSpaces: 0,
        availableSpaces: 0,
        disabledSpaces: 0,
    }); // 주차장 정보 상태 관리
    const [coordinates, setCoordinates] = useState([]); // coordinates 상태 추가
    const [kakaoSdkLoaded, setKakaoSdkLoaded] = useState(false); // SDK 로드 여부 상태 추가
    const [address, setAddress] = useState('');  // 주소 상태 추가

    // 쿼리 파라미터에서 위도(latitude), 경도(longitude), 주소(address) 값 가져오기
    const queryParams = new URLSearchParams(location.search);
    const latitude = queryParams.get('latitude');  // 위도 값 가져오기
    const longitude = queryParams.get('longitude');  // 경도 값 가져오기
    const navigate = useNavigate();

    // 쿼리 파라미터 확인
    useEffect(() => {
        console.log("Latitude:", latitude, "Longitude:", longitude);
    }, [latitude, longitude]);

    useEffect(()=> {
        if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)){
            initializeKakaoRoadview(parseFloat(latitude), parseFloat(longitude)); 
            fetchAddress(parseFloat(latitude), parseFloat(longitude));  // 첫 번째 위치에서 주소 받아오기
        } else {
            console.error('위도와 경도 정보가 유효하지 않습니다.');
        }
    }, [latitude, longitude]); // 위도와 경도 값이 변경될 때마다 로드뷰 업데이트

    // 랜덤 값을 생성하는 함수
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

    // 서버에서 DB의 경도와 위도 가져오기
    const fetchParkingData = async () => {
        try {
            const response = await axios.get('http://localhost:4000/parkingSearch/parkinglist3');
            setCoordinates(response.data.coordinates);
        } catch (error) {
            console.error('서버에서 데이터 가져오기 실패', error);
        }
    };

    useEffect(() => {
        fetchParkingData(); // 서버에서 데이터 가져오기
    }, []);

    // 카카오 SDK 로드
    const initializeKakaoRoadview = (latitude, longitude) => {
        if (window.kakao) {
            console.log('Kakao SDK 이미 로드됨');
            setKakaoSdkLoaded(true); // SDK가 이미 로드되었으면 바로 상태 변경
        } else {
            const script = document.createElement('script');
            const kakaoAppKey = process.env.REACT_APP_PARKINGSERVER_API_KEY;  // 본인의 카카오 API Key로 변경
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
            script.onerror = () => console.error('카카오 SDK 로드 실패');
            document.body.appendChild(script); 
        }
    };

    // 카카오 SDK가 로드되었을 때 로드뷰 초기화
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

    // 위도, 경도로 주소를 가져오는 함수
    const fetchAddress = (latitude, longitude) => {
        if (window.kakao) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            const latlng = new window.kakao.maps.LatLng(latitude, longitude);

            geocoder.coord2Address(latlng.getLng(), latlng.getLat(), (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const newAddress = result[0].address.address_name;
                    setAddress(newAddress);  // 주소 설정
                    console.log('주소:', newAddress);
                } else {
                    console.error('주소 변환 실패');
                }
            });
        }
    };

    const handleParkingClick = (latitude,longitude,address) => {
        console.log(`클릭한 주소: ${address}, 위도:${latitude},경도:${longitude}`);
        navigate(`/Myparking_place? latitude=${latitude}&longitude=${longitude}`)
    };

    // 두 번째 위도/경도로 로드뷰를 갱신하는 함수
    const updateRoadviewWithNewCoordinates = (latitude, longitude) => {
        if (latitude && longitude) {
            fetchAddress(latitude, longitude); // 새로운 좌표로 주소 갱신
            initializeKakaoRoadview(latitude, longitude);  // 새로운 좌표로 로드뷰 갱신
        }
    };

    

    return (
        <div className="parkinglot-status-container">
            <div className="parkinglot-address-container">
                <div className="parkinglot-address">{address || '주소를 불러오는 중...'}</div>
                {/* 스타 아이콘 아래에 ParkingList_Item을 추가 */}
                <div className="parking-list">
                    {coordinates.length === 0 ? (
                        <p>데이터가 없습니다.</p>
                    ) : (
                        coordinates.map((item, index) => (
                            <ParkingList_Item
                                // key={index}
                                // onAddressClick={() => handleParkingClick(item.latitude, item.longitude, item.address)} // 클릭 시 이동
                            />
                        ))
                    )}
                </div>
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
