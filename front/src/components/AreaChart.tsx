import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import Box from '@mui/material/Box';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export const buildData = (labels: string[], data: number[]) => ({
  labels,
  datasets: [
    {
      fill: true,
      label: 'XP',
      data,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
});


type AreaChartProps = {
  style?: any;
  labels: string[];
  data: number[];
  title?: string;
};

export function AreaChart(props: AreaChartProps) {
  return <Box sx={props.style}>
    <Line options={options} data={buildData(props.labels, props.data)} />
  </Box>;
}