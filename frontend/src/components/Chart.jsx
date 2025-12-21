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
          setError('Awaiting feedback data for visualization...');
          setChartData(null);
        }
      } catch (err) { setError('Failed to synchronize chart data.'); }
    };
    
    fetchChart();
    const interval = setInterval(fetchChart, 10000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/30">
            <BarChartHorizontal size={20} className="text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Live Sentiment Overview</h3>
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-white/5 rounded-xl p-4 border border-white/5">
        {chartData ? (
          <img src={chartData} alt="Sentiment analysis chart" className="max-w-full rounded opacity-90" />
        ) : (
          <p className="text-slate-500 text-sm text-center italic">{error || 'Initializing visualization...'}</p>
        )}
      </div>
    </div>
  );
}

export default Chart;