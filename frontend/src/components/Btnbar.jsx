import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Btnbar = () => {
  const navigate = useNavigate();

  const click01=()=>{
    navigate('/parkinglot01')
  }

  const click02=()=>{
    navigate('/parkinglot02')
  }

  const click03=()=>{
    navigate('/parkinglot03')
  }

  const click04=()=>{
    navigate('/parkinglot04')
  } 

  return (
    <div className="bottom-bar">
      <Button className="button" onClick={click04}>
          <img src="/images/house.png" alt="" />
          <br />
          <div>HOME</div>
      </Button>
      <Button className="button" onClick={click03}>
          <img src="/images/search.png" alt="" />
          <br />
          <div>주차장 찾기</div>
      </Button>
      <Button className="button" onClick={click02}>
          <img src="/images/stars.png" alt="" />
          <br />
          <div>즐겨찾기</div>
      </Button>
      <Button className="button" onClick={click01}>
          <img src="/images/setting.png" alt="" />
          <br />
          <div>설정</div>
      </Button>
    </div>
  );
};

export default Btnbar;
