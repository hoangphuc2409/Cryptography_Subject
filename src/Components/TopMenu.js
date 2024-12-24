import '../Styles/TopMenu.css';
import { Link } from 'react-router-dom';
import React, { useContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import axios from "axios";

function TopMenu() {
    const navigate = useNavigate();

    //LogOut button
    const { logout } = useContext(UserContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Hàm kiểm tra token
    const checkTokenExpiration = async () => {
    let user = localStorage.getItem('user'); //Nơi lưu token
    let token = user.jwt;
    
    if (!token) {
        alert("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!");
        handleLogout();
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/verify-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const data = await response.json();
            if (data.expired) {
                handleLogout();
            }
        }
    } catch (error) {
        console.error('Token verification error:', error);
        handleLogout();
    }
    };

    // Kiểm tra token định kỳ
    useEffect(() => {
    const interval = setInterval(() => {
        checkTokenExpiration();
    }, 60000); // Kiểm tra mỗi phút

    return () => clearInterval(interval);
    }, []);

    // Thêm interceptor cho axios
    axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            handleLogout();
        }
        return Promise.reject(error);
    }
    );
    
    //Xử lý button đang được chọn
    const [activeIndex, setActiveIndex] = useState(null);
    const handleBtnClick = (index) => {
        setActiveIndex(index);
    };

    //Profile button
    const handleProfile = () => {
        navigate('/Profile');
    }

    return (
        <div className="HeaderBar">
            <ul className="Items">

                {/*HOME*/ }
                <li className ="homeBtn" onClick={() => handleBtnClick(0)}>
                    <Link to="/Home">
                    <button
                        style={{ border: activeIndex === 0 ? '1px solid black' : 'none', 
                                 backgroundColor: activeIndex === 0 ? 'black' : 'white',
                                 color: activeIndex === 0 ? 'white' : 'black',
                                 transition: 'border 0.3s'}}
                    >Home
                    </button>
                    </Link>
                </li>

                 {/*UPLOAD*/ }
                <li onClick={() => handleBtnClick(1)}>
                    <Link to="/Upload">
                    <button
                        style={{ border: activeIndex === 1 ? '1px solid black' : 'none', 
                                 backgroundColor: activeIndex === 1 ? 'black' : 'white',
                                 color: activeIndex === 1 ? 'white' : 'black',
                                 transition: 'border 0.3s'}}
                    >Create
                    </button>
                    </Link>
                </li>

                {/*SETTINGS*/ }
                <li onClick={() => handleBtnClick(2)}>
                    <Link to="/Settings">
                    <button
                        style={{ border: activeIndex === 2 ? '1px solid black' : 'none', 
                                 backgroundColor: activeIndex === 2 ? 'black' : 'white',
                                 color: activeIndex === 2 ? 'white' : 'black',
                                 transition: 'border 0.3s'}}
                    >Settings
                    </button>
                    </Link>
                </li>

                {/*LOG HISTORY*/ }
                <li onClick={() => handleBtnClick(3)}>
                    <Link to="/Log">
                    <button
                        style={{ border: activeIndex === 3 ? '1px solid black' : 'none', 
                                 backgroundColor: activeIndex === 3 ? 'black' : 'white',
                                 color: activeIndex === 3 ? 'white' : 'black',
                                 transition: 'border 0.3s'}}
                    >Log History
                    </button>
                    </Link>
                </li>

                <div className='rightBtn'>
                    <button className='accBtn' onClick={handleProfile}><FontAwesomeIcon icon={faUser} /></button>
                    <button className='logOutBtn' onClick={handleLogout}>Log Out</button> {/*LOGOUT*/ }
                </div>
            </ul>
        </div>
    );
}

export { TopMenu };
