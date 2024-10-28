import React, { useState, useEffect, useRef } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './HomePage.css'; // Import file CSS riêng cho HomePa
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DoanhThu from './DoanhThu' // Import component 
import NhapHang from './NhapHang' // Import component
import QuanLyDonHang from './QuanLyDonHang' // Import component
import QuanLyKho from './QuanLyKho' // Import component

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const HomePage = () => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [user, setUser] = useState(localStorage.getItem('user') || 'Guest'); // Lấy thông tin người dùng từ localStorage
  const accountMenuRef = useRef(null); // Tạo ref cho account-menu

  const handleAccountClick = () => {
    setShowAccountMenu(!showAccountMenu);
  };

  const handleLogout = () => {
    // Logic để logout
    localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi localStorage
    setUser('Guest'); // Cập nhật state user
    window.location.href = '/';
  };

  const handleClickOutside = (event) => {
    if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
      setShowAccountMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

return (
    <div className="homepage-container">
        <header className="header">
            <div className="header-left">
                <h1><i className="fas fa-store"></i> Shop bóng bàn Mạnh Dũng</h1>
            </div>
            <div className="header-right">
                <div className="account-info">
                    <i className="fas fa-user-circle" onClick={handleAccountClick}></i>
                    
                </div>
                {showAccountMenu && (
                    <div className="account-menu" ref={accountMenuRef}>
                        <p>Admin: {user}</p>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </header>
        <nav className="navbar">
            <ul>
                <li><Link to="/home-page/doanh-thu"><i className="fas fa-chart-line"></i> Doanh thu</Link></li>
                <li><Link to="/home-page/quan-ly-don-hang"><i className="fas fa-receipt"></i> Quản lý đơn hàng</Link></li>
                <li><Link to="/home-page/quan-ly-kho"><i className="fas fa-warehouse"></i> Quản lý kho hàng</Link></li>
                <li><Link to="/home-page/nhap-hang"><i className="fas fa-truck-loading"></i> Nhập hàng</Link></li>
            </ul>
        </nav>
        <main className="main-content">
            <Routes>
                <Route path="nhap-hang" element={<NhapHang />} />
                <Route path="quan-ly-kho" element={<QuanLyKho />} />
                <Route path="quan-ly-don-hang" element={<QuanLyDonHang />} />
                <Route path="doanh-thu" element={<DoanhThu />} />
            </Routes>
        </main>
    </div>
);
};

export default HomePage;