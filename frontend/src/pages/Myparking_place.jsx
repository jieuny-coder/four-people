import Btnbar from '../components/Btnbar';
import Topbar from '../components/Topbar';
import '../index.css';

export const Myparking_place = () => {
   

    return (
        <div className="parking-lot">
            <div className="component-2">
                <div className="component-2-child"></div>
                <div className="vector-3-parent" id="frameContainer">
                    <img className="vector-3-icon" alt="" src="vector-3.svg" />
                </div>
            </div>
            <div><Topbar/>
                <div className="div1">주차장 상태</div>
            </div>
            <div><Btnbar/></div>
            <div className="div9">
                <div className="item"></div>
            </div>
            <div className="rectangle-parent">
                <div className="instance-child"></div>
                <div className="wrapper">
                    <div className="div11">주차장 주소 나타나는 부분</div>
                    <img className="icon" alt="" src="images/stars.png" />
                </div>
            </div>
            <div className="inner">
            <div className="or">주차장 상태 사진 or 이미지</div>
            </div>
            <div className="rectangle-group">
                <div className="group-child"></div>
                <div className="div12">주차장 정보</div>
            </div>
            <div className="div13">총 주차 구역수</div>
            <div className="div14">현재 주차 가능 수</div>
            <div className="div15">장애인전용주차 가능 수</div>
            <div className="rectangle-container">
                <div className="group-child"></div>
                <div className="div12">현재 이벤트</div>
            </div>
            <div className="div17">가로주차</div>
            <div className="div18">통행방해</div>
        </div>
    );
};
