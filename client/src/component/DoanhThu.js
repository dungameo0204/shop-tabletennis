import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const DoanhThu = () => {
    const data = {
      labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      datasets: [
        {
          label: 'Doanh thu (triệu VND)',
          data: [12, 19, 3, 5, 2, 3, 10, 15, 7, 8, 9, 6], // Dữ liệu doanh thu theo tháng
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Doanh thu theo tháng',
        },
      },
    };
  
    return (
      <section>
        <h2>Doanh thu</h2>
        <Bar data={data} options={options} />
      </section>
    );
};

export default DoanhThu;
