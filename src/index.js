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
  const [status, setStatus] = useState(null); // State để lưu trạng thái từ phản hồi
  const [errorMessage, setErrorMessage] = useState(''); // Thông báo lỗi (nếu có)

  const checkUserIp = async () => {
    try {
      // Lấy IP của người dùng từ ipify API
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const userIp = ipResponse.data.ip;
      setUserIp(userIp); // Lưu IP vào state

      // Gửi IP đến backend để kiểm tra và lưu trạng thái
      const checkResponse = await axios.post('http://localhost:4000/api/check-ip', { ip: userIp });
      setStatus(checkResponse.status); // Lưu trạng thái phản hồi vào state
    } catch (error) {
      // Xử lý lỗi
      if (error.response) {
        setStatus(error.response.status); // Lưu trạng thái lỗi từ backend
        setErrorMessage(error.response.data.message || 'Lỗi không xác định');
      } else {
        setErrorMessage('Không thể kết nối với server.');
      }
      console.error('Lỗi kiểm tra IP:', error);
    }
  };

  useEffect(() => {
    checkUserIp(); // Gọi hàm kiểm tra IP khi load trang
  }, []);

  // Khi status là 200, hiển thị ứng dụng chính
  if (status === 200) {
    return (
      <React.StrictMode>
        <Router>
          <UserProvider>
            <App userIp={userIp} /> {/* Truyền userIp vào App */}
          </UserProvider>
        </Router>
      </React.StrictMode>
    );
  }

  // Khi status khác 200, hiển thị IP và thông báo lỗi
  return (
    <div>
      {userIp && (
        <>
          <h2>IP của bạn: {userIp}</h2>
          <h3>Trạng thái kiểm tra: {status || 'Đang kiểm tra...'}</h3>
        </>
      )}
      {status !== 200 && errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);

reportWebVitals();
