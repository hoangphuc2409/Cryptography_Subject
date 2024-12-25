import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './Components/UserContext';
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));

const Index = () => {
  const [userIp, setUserIp] = useState(null); // State để lưu IP
  const [isAllowed, setIsAllowed] = useState(false); // Trạng thái kiểm tra IP
  const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi (nếu có)

  const checkUserIp = async () => {
    try {
      // Lấy IP từ ipify API
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const userIp = ipResponse.data.ip;
      setUserIp(userIp); // Lưu IP vào state

      // Gửi IP tới backend để kiểm tra
      const checkResponse = await axios.post('http://localhost:4000/api/check-ip', { ip: userIp });

      if (checkResponse.status === 200) {
        setIsAllowed(true); // IP hợp lệ
      }
    } catch (error) {
      setIsAllowed(false); // IP không hợp lệ
      setErrorMessage(
        error.response?.data?.message || 'Không thể kết nối với server. Vui lòng thử lại.'
      );
    }
  };

  useEffect(() => {
    checkUserIp(); // Kiểm tra IP khi load trang
  }, []);

  if (isAllowed) {
    // Khi IP hợp lệ, hiển thị ứng dụng chính
    return (
      <React.StrictMode>
        <Router>
          <UserProvider>
            <App userIp={userIp} /> {/* Truyền IP hợp lệ vào App */}
          </UserProvider>
        </Router>
      </React.StrictMode>
    );
  }

  return (
    <div>
      {errorMessage
        ? errorMessage // Hiển thị thông báo lỗi nếu có
        : `IP của bạn: ${userIp || 'Đang kiểm tra...'} và Trạng thái kiểm tra: ${
            userIp ? 'Đang kiểm tra...' : ''
          }`}
    </div>
  );
};

root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);

reportWebVitals();
