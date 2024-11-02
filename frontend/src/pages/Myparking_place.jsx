import Btnbar from '../components/Btnbar';


export const Myparking_place = () => {
    return (
        <div className="parkinglot-status-container">
            {/* <div className="parkinglot-header">주차장 상태</div> */}
            <div className="parkinglot-address-container">
                <div className="parkinglot-address">주차장 주소 나타내는 부분</div>
                <img className="parkinglot-star-icon" alt="" src="images/stars.png" />
            </div>
            <div className="parkinglot-image-container">
                {/* <div className="parkinglot-image-placeholder">주차장 상태 사진 or 이미지</div> */}
                <img className="parkinglot-image" alt="" src="/images/parking_image.jpg" />
            </div>
            <div className="parkinglot-info-button">주차장 정보</div>
            <div className="parkinglot-info-details">
                <div className="parkinglot-info-text">총 주차 구역수</div>
                <div className="parkinglot-info-text">현재 주차 가능 수</div>
                <div className="parkinglot-info-text">장애인전용주차 가능 수</div>
            </div>
            <div className="parkinglot-event-button">현재 이벤트</div>
            <div className="parkinglot-event-details">
                <div className="parkinglot-event-text">가로주차</div>
                <div className="parkinglot-event-text">통행방해</div>
            </div>
            <Btnbar />
        </div>
    );
};
