import React, { useState, useEffect } from 'react';
import { getChart } from '../api';
import { BarChartHorizontal } from 'lucide-react';

function Chart() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const response = await getChart();
        if (response.data.chart) {
          setChartData(`data:image/png;base64,${response.data.chart}`);
          setError('');
        } else {
          setError('No data to display. Submit feedback to see the chart!');
          setChartData(null);
        }
      } catch (err) { setError('Failed to load chart.'); }
    };
    
    fetchChart();
    const interval = setInterval(fetchChart, 10000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-soft-lg h-full">
      <div className="flex items-center gap-3 mb-4">
        <BarChartHorizontal size={20} className="text-primary-dark" />
        <h3 className="text-xl font-bold">Live Sentiment Overview</h3>
      </div>
      <div className="flex items-center justify-center min-h-[200px] bg-neutral-100 rounded-xl p-4">
        {chartData ? (
          <img src={chartData} alt="Sentiment analysis chart" className="max-w-full" />
        ) : (
          <p className="text-neutral-500 text-sm text-center">{error || 'Loading chart...'}</p>
        )}
      </div>
    </div>
  );
}

export default Chart;
