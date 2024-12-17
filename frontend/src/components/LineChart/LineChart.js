import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ title, labelInput, dataInput }) => {
  const data = {
    labels: labelInput,
    datasets: [
      {
        label: title,
        data: dataInput,
        fill: true,
        backgroundColor: 'rgba(255, 167, 38, 0.3)',
        borderColor: 'rgba(255, 167, 38, 1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: false,
        text: 'User Activity Over Time',
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
      },
      y: {
        grid: {
          display: true,
        },
        ticks: {
          stepSize: (Math.max(...dataInput) - Math.min(...dataInput)) < 1 ? 1 : Math.ceil((Math.max(...dataInput) - Math.min(...dataInput)) / 5),
          // stepSize: 1,
        },
        suggestedMax: Math.max(...dataInput) + 1,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
