import React, { useState } from 'react';
import axios from 'axios';
import './AdminLogin.css'; 
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [admin, setAdmin] = useState({ admin_user: '', admin_password: '' });
  const [message, setMessage] = useState(''); // State để lưu trữ thông 
  const navigate = useNavigate(); // Sử dụng hook useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://localhost:3002/api/login-admin', { params: admin });
      if (!response.data || response.data.length === 0) {
        setMessage('Không tìm thấy tên đăng nhập');
        return;
      } else {
        const adminData = response.data[0];
        if (adminData.admin_password === admin.admin_password) {
          setMessage('Đăng nhập thành công');
          localStorage.setItem('user', admin.admin_user);
          navigate('/home-page');
        } else {
          setMessage('Sai mật khẩu');
        }
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra trong quá trình đăng nhập');
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="admin_user">Tên đăng nhập:</label>
            <input 
              type="text" 
              name="admin_user" 
              id="admin_user" 
              value={admin.admin_user} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="admin_password">Mật khẩu:</label>
            <input 
              type="password" 
              name="admin_password" 
              id="admin_password" 
              value={admin.admin_password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="btn-login">Đăng nhập</button>
        </form>
        {message && <p className="message">{message}</p>} {/* Hiển thị thông báo */}
      </div>
    </div>
  );
};

export default AdminLogin;