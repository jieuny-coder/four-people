import React from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

function SelectsBox() {
  return (
    <FloatingLabel controlId="floatingSelect" label="선택리스트" style={{width: '350px',height:''}}>
      <Form.Select aria-label="Floating label select example" style={{ lineHeight: '1.5', height: '80px' }}>
        <option>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </Form.Select>
    </FloatingLabel>
  );
  }
  
  export default SelectsBox;
