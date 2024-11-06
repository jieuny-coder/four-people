import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
    const navigate = useNavigate();

    const handleLogoClick  = () => {
        console.log("로고 클릭");
        navigate('/login'); // '/login' 경로로 이동

    };

    return (
        <div className='main_background'>
            <img src='/images/start_IMG.png' alt='background_image' className='background_image' />
            <div className='centered_logo_container' onClick={handleLogoClick}>
                <img src='/images/logo.jpg' alt='centered_logo_image' className='centered_logo_image' />
            </div>
        </div>
    )
}

export default Main