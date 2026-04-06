import React from 'react';
import ReactECharts from 'echarts-for-react';

export const Sparkline = ({ data }) => {
  // Check trend: Agar current price pehli price se zyada hai toh Green, nahi toh Red
  const isUp = data[data.length - 1] >= data[0];
  const lineColor = isUp ? '#4ade80' : '#f87171'; // Tailwind text-green-400 : text-red-400

  const option = {
    animation: false, // Performance ke liye animation band
    grid: { left: 0, right: 0, top: 5, bottom: 5 }, // No margins
    xAxis: { type: 'category', show: false, data: data.map((_, i) => i) },
    yAxis: { type: 'value', show: false, min: 'dataMin', max: 'dataMax' },
    series: [
      {
        type: 'line',
        data: data,
        smooth: true, // Line ko thoda curvy banayega
        symbol: 'none', // Chart par dots nahi dikhayega
        lineStyle: { width: 2, color: lineColor },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      opts={{ renderer: 'canvas' }} // Canvas mode DOM nodes bachata hai
      style={{ height: '40px', width: '100px' }}
    />
  );
};