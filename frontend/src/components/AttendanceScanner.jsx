// import React, { useState, useEffect } from 'react';
// import { Scanner } from '@yudiel/react-qr-scanner';
// import { markAttendance, getTodayAttendanceCount } from '../api';
// import { QrCode, Users, CheckCircle, XCircle } from 'lucide-react';

// function AttendanceScanner() {
//   const [mealType, setMealType] = useState('Lunch');
//   const [scannedData, setScannedData] = useState(null);
//   const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'
//   const [count, setCount] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);

//   // Fetch current count on load
//   useEffect(() => {
//     fetchCount();
//   }, []);

//   const fetchCount = async () => {
//     try {
//       const res = await getTodayAttendanceCount();
//       setCount(res.data.total_students_eaten);
//     } catch (err) { console.error("Failed to fetch count"); }
//   };

//   const handleScan = async (detectedCodes) => {
//     if (isPaused || !detectedCodes || detectedCodes.length === 0) return;

//     const rawValue = detectedCodes[0].rawValue;
//     if (rawValue === scannedData) return; // Prevent duplicate scans of same code immediately

//     setIsPaused(true); // Pause scanning while processing
//     setScannedData(rawValue);

//     try {
//       // Call Backend
//       await markAttendance(rawValue, mealType);

//       // Success Handling
//       setMessage({ text: `Verified: ${rawValue}`, type: 'success' });
//       fetchCount(); // Update the counter instantly

//       // Resume scanning after 2 seconds
//       setTimeout(() => {
//         setScannedData(null);
//         setMessage({ text: '', type: '' });
//         setIsPaused(false);
//       }, 2000);

//     } catch (error) {
//       // Error Handling (e.g. "Already marked present")
//       const errorMsg = error.response?.data?.detail || "Scan Failed";
//       setMessage({ text: errorMsg, type: 'error' });

//       setTimeout(() => {
//         setScannedData(null);
//         setMessage({ text: '', type: '' });
//         setIsPaused(false);
//       }, 2000);
//     }
//   };

//   return (
//     <div className="grid md:grid-cols-2 gap-8">
//       {/* LEFT: Camera Section */}
//       <div className="bg-white p-6 rounded-2xl shadow-soft-lg">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xl font-bold flex items-center gap-2">
//             <QrCode className="text-primary-dark" /> Scanner
//           </h3>
//           <select
//             value={mealType}
//             onChange={(e) => setMealType(e.target.value)}
//             className="p-2 bg-neutral-100 rounded-lg font-semibold text-sm border-none focus:ring-2 focus:ring-primary"
//           >
//             <option>Breakfast</option>
//             <option>Lunch</option>
//             <option>Snacks</option>
//             <option>Dinner</option>
//           </select>
//         </div>

//         <div className="relative overflow-hidden rounded-xl border-2 border-neutral-900 bg-black aspect-square">
//             <Scanner
//                 onScan={handleScan}
//                 scanDelay={500}
//                 allowMultiple={true}
//             />

//             {/* Overlay for "Scanning..." state */}
//             {isPaused && (
//                <div className={`absolute inset-0 flex items-center justify-center bg-black/80 z-10 animate-in fade-in`}>
//                   {message.type === 'success' ? (
//                     <div className="text-center text-green-500">
//                       <CheckCircle size={64} className="mx-auto mb-2" />
//                       <p className="font-bold text-xl">Marked Present!</p>
//                     </div>
//                   ) : (
//                     <div className="text-center text-red-500">
//                       <XCircle size={64} className="mx-auto mb-2" />
//                       <p className="font-bold text-xl">Error</p>
//                     </div>
//                   )}
//                </div>
//             )}
//         </div>

//         <p className="mt-4 text-center text-sm text-neutral-500">
//            {message.text || `Scanning for ${mealType}...`}
//         </p>
//       </div>

//       {/* RIGHT: Stats Section */}
//       <div className="flex flex-col gap-6">
//         <div className="bg-primary text-white p-8 rounded-2xl shadow-soft-lg flex-1 flex flex-col items-center justify-center text-center">
//             <div className="bg-white/20 p-4 rounded-full mb-4">
//                 <Users size={48} />
//             </div>
//             <h2 className="text-6xl font-bold mb-2">{count}</h2>
//             <p className="text-lg opacity-90">Students Served Today</p>
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow-soft h-full">
//             <h4 className="font-bold text-neutral-800 mb-2">Instructions</h4>
//             <ul className="text-sm text-neutral-500 space-y-2 list-disc pl-5">
//                 <li>Ensure the student's phone brightness is high.</li>
//                 <li>Select the correct <strong>Meal Type</strong> before scanning.</li>
//                 <li>The system will prevent double-scanning the same student for the same meal.</li>
//             </ul>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AttendanceScanner;

import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { markAttendance, getTodayAttendanceCount } from "../api";
import { QrCode, Users, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast"; // <--- Import

function AttendanceScanner() {
  const [mealType, setMealType] = useState("Lunch");
  const [scannedData, setScannedData] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [count, setCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchCount();
  }, []);

  const fetchCount = async () => {
    try {
      const res = await getTodayAttendanceCount();
      setCount(res.data.total_students_eaten);
    } catch (err) {
      console.error("Failed to fetch count");
    }
  };

  const handleScan = async (detectedCodes) => {
    if (isPaused || !detectedCodes || detectedCodes.length === 0) return;

    const rawValue = detectedCodes[0].rawValue;
    if (rawValue === scannedData) return;

    setIsPaused(true);
    setScannedData(rawValue);

    try {
      await markAttendance(rawValue, mealType);

      // Both Visual Overlay AND Toast
      setMessage({ text: `Verified: ${rawValue}`, type: "success" });
      toast.success(`Verified: ${rawValue}`); // <--- Toast
      fetchCount();

      setTimeout(() => {
        setScannedData(null);
        setMessage({ text: "", type: "" });
        setIsPaused(false);
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Scan Failed";
      setMessage({ text: errorMsg, type: "error" });
      toast.error(errorMsg); // <--- Toast

      setTimeout(() => {
        setScannedData(null);
        setMessage({ text: "", type: "" });
        setIsPaused(false);
      }, 2000);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* LEFT: Camera Section */}
      <div className="bg-white p-6 rounded-2xl shadow-soft-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <QrCode className="text-primary-dark" /> Scanner
          </h3>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="p-2 bg-neutral-100 rounded-lg font-semibold text-sm border-none focus:ring-2 focus:ring-primary"
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Snacks</option>
            <option>Dinner</option>
          </select>
        </div>

        <div className="relative overflow-hidden rounded-xl border-2 border-neutral-900 bg-black aspect-square">
          <Scanner onScan={handleScan} scanDelay={500} allowMultiple={true} />

          {isPaused && (
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/80 z-10 animate-in fade-in`}
            >
              {message.type === "success" ? (
                <div className="text-center text-green-500">
                  <CheckCircle size={64} className="mx-auto mb-2" />
                  <p className="font-bold text-xl">Marked Present!</p>
                </div>
              ) : (
                <div className="text-center text-red-500">
                  <XCircle size={64} className="mx-auto mb-2" />
                  <p className="font-bold text-xl">Error</p>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-neutral-500">
          {message.text || `Scanning for ${mealType}...`}
        </p>
      </div>

      {/* RIGHT: Stats Section */}
      <div className="flex flex-col gap-6">
        <div className="bg-primary text-white p-8 rounded-2xl shadow-soft-lg flex-1 flex flex-col items-center justify-center text-center">
          <div className="bg-white/20 p-4 rounded-full mb-4">
            <Users size={48} />
          </div>
          <h2 className="text-6xl font-bold mb-2">{count}</h2>
          <p className="text-lg opacity-90">Students Served Today</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-soft h-full">
          <h4 className="font-bold text-neutral-800 mb-2">Instructions</h4>
          <ul className="text-sm text-neutral-500 space-y-2 list-disc pl-5">
            <li>Ensure the student's phone brightness is high.</li>
            <li>
              Select the correct <strong>Meal Type</strong> before scanning.
            </li>
            <li>
              The system will prevent double-scanning the same student for the
              same meal.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AttendanceScanner;
