import React from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

const InputBox = ({ className, label, placeholder }) => {
  return (
    <>
      <FloatingLabel controlId="floatingInput" label={label} className="mb-3">
        <Form.Control 
          type="text" 
          placeholder={placeholder} 
          className={className} 
        />
      </FloatingLabel>
    </>
  );
};

export default InputBox;
