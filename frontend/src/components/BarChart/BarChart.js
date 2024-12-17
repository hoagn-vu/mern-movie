import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ title, labelInput, dataInput }) => {
  const data = {
    labels: labelInput,
    datasets: [
      {
        label: title,
        data: dataInput,
        backgroundColor: 'rgba(255, 167, 38, 0.3)',
        borderColor: 'rgba(255, 167, 38, 1)',
        borderWidth: 1,
        barThickness: 25,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
      },
      title: {
        display: false,
        text: 'Movies Created Per Month',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
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

  return <Bar data={data} options={options} />;
};

export default BarChart;
