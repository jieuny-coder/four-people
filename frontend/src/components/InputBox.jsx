import React from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

const InputBox = () => {
  return (
    <>
      <FloatingLabel controlId="floatingInput" label="내용바꿔서사용" className="mb-3">
        <Form.Control type="text" placeholder="텍스트내용바꿔서사용" />
      </FloatingLabel>
    </>
  );
};

export default InputBox;
