import React, { useEffect, useState } from 'react';
import { getDemandForecast, getWasteChart, getTomorrowWaste } from '../api';
import { TrendingUp, BarChart2, AlertCircle } from 'lucide-react';

function Predictions() {
  const [forecast, setForecast] = useState([]);
  const [wasteChart, setWasteChart] = useState(null);
  const [wasteText, setWasteText] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const forecastRes = await getDemandForecast();
        setForecast(forecastRes.data);

        const chartRes = await getWasteChart();
        if (chartRes.data.chart) {
          setWasteChart(`data:image/png;base64,${chartRes.data.chart}`);
        }

        const textRes = await getTomorrowWaste();
        if (!textRes.data.error) {
            setWasteText(textRes.data);
        }
      } catch (e) { console.error("Error fetching predictions", e); }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Demand Forecast Section */}
      <div className="glass-card p-8 rounded-2xl">
         <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-500/20 p-3 rounded-full border border-blue-500/30 text-blue-400">
                <TrendingUp size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white">Demand Intelligence</h3>
                <p className="text-sm text-slate-400">AI-driven attendance forecasting model</p>
            </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {forecast.map((day, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl text-center hover:bg-white/10 transition-colors">
                    <p className="text-xs text-slate-500 font-bold uppercase mb-1 tracking-wider">{day.day}</p>
                    <p className="text-[10px] text-slate-600 mb-2 font-mono">{day.date}</p>
                    <p className="text-2xl font-bold text-cyan-400">{day.predicted_count}</p>
                    <p className="text-xs text-slate-400">Expected</p>
                </div>
            ))}
        </div>
      </div>

      {/* Waste Regression Section */}
      <div className="glass-card p-8 rounded-2xl">
         <div className="flex items-center gap-4 mb-8">
            <div className="bg-red-500/20 p-3 rounded-full border border-red-500/30 text-red-400">
                <BarChart2 size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white">Waste Estimation Model</h3>
                <p className="text-sm text-slate-400">Linear Regression Analysis (Student Count vs. Waste)</p>
            </div>
        </div>
        
        {/* Chart Container - Darkened */}
        <div className="flex justify-center bg-white/5 rounded-xl p-4 min-h-[300px] items-center mb-6 border border-white/5">
            {wasteChart ? (
                <img src={wasteChart} alt="Regression Analysis" className="max-w-full rounded-lg opacity-90 hover:opacity-100 transition-opacity" />
            ) : (
                <p className="text-slate-500 animate-pulse">Training Neural Model...</p>
            )}
        </div>

        {/* Textual Prediction - Dark Red Style */}
        {wasteText && (
            <div className="bg-red-900/20 border border-red-500/30 p-5 rounded-xl flex items-start gap-4">
                <AlertCircle className="text-red-400 mt-1 shrink-0" size={24} />
                <div>
                    <h4 className="font-bold text-red-300 text-lg mb-1">
                        Tomorrow's Insight ({wasteText.day})
                    </h4>
                    <p className="text-red-200/80 leading-relaxed text-sm">
                        Based on an expected attendance of <strong className="text-white">{wasteText.predicted_students} students</strong>, 
                        the AI model predicts approximately <strong className="text-white bg-red-500/20 px-1 rounded">{wasteText.predicted_waste_kg} kg</strong> of food waste.
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default Predictions;