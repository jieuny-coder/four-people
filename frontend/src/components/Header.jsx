// Header.js
import React from 'react';

const Header = ({ title }) => {
    console.log("Header title:", title); // title 값을 콘솔에 출력

    return (
        <div className="header_custom_container">
            <div className="header_custom_back_button">&#x2190;</div>
            <h1 className="header_custom_title">{title}</h1>
        </div>
    );
};

export default Header;
