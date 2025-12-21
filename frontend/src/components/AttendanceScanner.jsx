import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { markAttendance, getTodayAttendanceCount } from "../api";
import { QrCode, Users, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

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

    // Use a loading toast with a fixed ID to prevent stacking
    const toastId = 'scanner-feed'; 
    toast.loading("Verifying...", { id: toastId });

    try {
      await markAttendance(rawValue, mealType);
      
      // Update the SAME toast to success
      toast.success(`Verified: ${rawValue}`, { id: toastId });
      setMessage({ text: `Verified: ${rawValue}`, type: "success" });
      
      fetchCount();
      setTimeout(() => {
        setScannedData(null);
        setMessage({ text: "", type: "" });
        setIsPaused(false);
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Scan Failed";
      
      // Update the SAME toast to error
      toast.error(errorMsg, { id: toastId });
      setMessage({ text: errorMsg, type: "error" });
      
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
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-3 text-white">
            <QrCode className="text-cyan-400" /> Scanner Link
          </h3>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="p-2 bg-black/40 border border-white/10 rounded-lg font-semibold text-sm text-white focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Snacks</option>
            <option>Dinner</option>
          </select>
        </div>

        {/* Camera Frame */}
        <div className="relative overflow-hidden rounded-xl border-2 border-cyan-500/30 bg-black aspect-square shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <Scanner onScan={handleScan} scanDelay={500} allowMultiple={true} />

          {isPaused && (
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/90 z-10 animate-in fade-in`}
            >
              {message.type === "success" ? (
                <div className="text-center text-green-400">
                  <CheckCircle
                    size={64}
                    className="mx-auto mb-2 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                  />
                  <p className="font-bold text-xl tracking-wider">
                    ACCESS GRANTED
                  </p>
                </div>
              ) : (
                <div className="text-center text-red-500">
                  <XCircle
                    size={64}
                    className="mx-auto mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  />
                  <p className="font-bold text-xl tracking-wider">DENIED</p>
                </div>
              )}
            </div>
          )}

          {/* Decorative Scan Line */}
          <div className="absolute inset-0 border-t-2 border-cyan-400/50 opacity-50 animate-[scan_2s_linear_infinite] pointer-events-none"></div>
        </div>

        <p className="mt-4 text-center text-sm text-slate-400 font-mono">
          {message.text || `Targeting: ${mealType}...`}
        </p>
      </div>

      {/* RIGHT: Stats Section */}
      <div className="flex flex-col gap-6">
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white p-8 rounded-2xl shadow-[0_0_30px_rgba(8,145,178,0.3)] flex-1 flex flex-col items-center justify-center text-center border border-white/10">
          <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm">
            <Users size={48} />
          </div>
          <h2 className="text-7xl font-bold mb-2 tracking-tighter">{count}</h2>
          <p className="text-lg text-cyan-100 font-medium tracking-wide">
            Live Headcount
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl h-full border border-white/5">
          <h4 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Operating Protocols
          </h4>
          <ul className="text-sm text-slate-400 space-y-3 list-disc pl-5">
            <li>
              Ensure student device brightness is <strong>100%</strong>.
            </li>
            <li>
              Confirm <strong>Meal Type</strong> before initiating scan.
            </li>
            <li>
              System automatically blocks <strong>Duplicate Entries</strong>.
            </li>
            <li>
              Students on <strong>Leave</strong> will trigger a Red Alert.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AttendanceScanner;
