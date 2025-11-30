// import React, { useEffect, useState } from 'react';
// import { getDemandForecast, getWasteChart } from '../api';
// import { TrendingUp, BarChart2 } from 'lucide-react';

// function Predictions() {
//   const [forecast, setForecast] = useState([]);
//   const [wasteChart, setWasteChart] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const forecastRes = await getDemandForecast();
//         setForecast(forecastRes.data);

//         const chartRes = await getWasteChart();
//         if (chartRes.data.chart) {
//           setWasteChart(`data:image/png;base64,${chartRes.data.chart}`);
//         }
//       } catch (e) { console.error("Error fetching predictions", e); }
//     };
//     fetchData();
//   }, []);

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       {/* Demand Forecast Section */}
//       <div className="bg-white p-6 rounded-2xl shadow-soft-lg">
//         <div className="flex items-center gap-3 mb-6">
//             <div className="bg-blue-100 p-2 rounded-full text-blue-600"><TrendingUp size={24} /></div>
//             <div>
//                 <h3 className="text-xl font-bold">Demand Forecasting (Next 7 Days)</h3>
//                 <p className="text-sm text-neutral-500">AI Prediction based on seeded historical data</p>
//             </div>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
//             {forecast.map((day, idx) => (
//                 <div key={idx} className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl text-center">
//                     <p className="text-xs text-neutral-500 font-bold uppercase mb-1">{day.day}</p>
//                     <p className="text-xs text-neutral-400 mb-2">{day.date}</p>
//                     <p className="text-2xl font-bold text-primary-dark">{day.predicted_count}</p>
//                     <p className="text-xs text-neutral-500">Expected Students</p>
//                 </div>
//             ))}
//         </div>
//       </div>

//       {/* Waste Regression Section */}
//       <div className="bg-white p-6 rounded-2xl shadow-soft-lg">
//          <div className="flex items-center gap-3 mb-6">
//             <div className="bg-red-100 p-2 rounded-full text-red-600"><BarChart2 size={24} /></div>
//             <div>
//                 <h3 className="text-xl font-bold">Waste Estimation Model</h3>
//                 <p className="text-sm text-neutral-500">Linear Regression (Student Count vs. Waste)</p>
//             </div>
//         </div>

//         <div className="flex justify-center bg-neutral-50 rounded-xl p-4 min-h-[300px] items-center">
//             {wasteChart ? (
//                 <img src={wasteChart} alt="Regression Analysis" className="max-w-full rounded-lg shadow-sm" />
//             ) : (
//                 <p className="text-neutral-400">Training model...</p>
//             )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Predictions;

import React, { useEffect, useState } from 'react';
import { getDemandForecast, getWasteChart, getTomorrowWaste } from '../api'; // Import new API
import { TrendingUp, BarChart2, AlertCircle } from 'lucide-react';

function Predictions() {
  const [forecast, setForecast] = useState([]);
  const [wasteChart, setWasteChart] = useState(null);
  const [wasteText, setWasteText] = useState(null); // State for the text

  useEffect(() => {
    const fetchData = async () => {
      try {
        const forecastRes = await getDemandForecast();
        setForecast(forecastRes.data);

        const chartRes = await getWasteChart();
        if (chartRes.data.chart) {
          setWasteChart(`data:image/png;base64,${chartRes.data.chart}`);
        }

        // Fetch Tomorrow's Specific Prediction
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
      <div className="bg-white p-6 rounded-2xl shadow-soft-lg">
         {/* ... (Keep existing Forecast Code) ... */}
         <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600"><TrendingUp size={24} /></div>
            <div>
                <h3 className="text-xl font-bold">Demand Forecasting (Next 7 Days)</h3>
                <p className="text-sm text-neutral-500">AI Prediction based on seeded historical data</p>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {forecast.map((day, idx) => (
                <div key={idx} className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl text-center">
                    <p className="text-xs text-neutral-500 font-bold uppercase mb-1">{day.day}</p>
                    <p className="text-xs text-neutral-400 mb-2">{day.date}</p>
                    <p className="text-2xl font-bold text-primary-dark">{day.predicted_count}</p>
                    <p className="text-xs text-neutral-500">Expected Students</p>
                </div>
            ))}
        </div>
      </div>

      {/* Waste Regression Section */}
      <div className="bg-white p-6 rounded-2xl shadow-soft-lg">
         <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-2 rounded-full text-red-600"><BarChart2 size={24} /></div>
            <div>
                <h3 className="text-xl font-bold">Waste Estimation Model</h3>
                <p className="text-sm text-neutral-500">Linear Regression (Student Count vs. Waste)</p>
            </div>
        </div>
        
        <div className="flex justify-center bg-neutral-50 rounded-xl p-4 min-h-[300px] items-center mb-6">
            {wasteChart ? (
                <img src={wasteChart} alt="Regression Analysis" className="max-w-full rounded-lg shadow-sm" />
            ) : (
                <p className="text-neutral-400">Training model...</p>
            )}
        </div>

        {/* --- NEW TEXTUAL PREDICTION --- */}
        {wasteText && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-500 mt-1" size={20} />
                <div>
                    <h4 className="font-bold text-red-700 text-lg">
                        Tomorrow ({wasteText.day})
                    </h4>
                    <p className="text-red-600">
                        Based on an expected attendance of <strong>{wasteText.predicted_students} students</strong>, 
                        the AI model predicts approximately <strong>{wasteText.predicted_waste_kg} kg</strong> of food waste.
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default Predictions;