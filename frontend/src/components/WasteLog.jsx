import React, { useState, useEffect } from "react";
import { logWaste, getWasteAnalytics } from "../api";
import { Trash2, TrendingDown } from "lucide-react";
import toast from "react-hot-toast";

function WasteLog() {
  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split("T")[0],
    meal_type: "Lunch",
    total_prepared_kg: "",
    total_waste_kg: "",
    student_count: "",
  });
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await getWasteAnalytics();
      setLogs(res.data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = "waste-log"; // Fixed ID
    toast.loading("Logging data...", { id: toastId });

    try {
      await logWaste(formData);
      toast.success("Waste logged successfully!", { id: toastId });

      fetchLogs();
      setFormData({
        ...formData,
        total_prepared_kg: "",
        total_waste_kg: "",
        student_count: "",
      });
    } catch (err) {
      toast.error("Failed to log data. Are you logged in?", { id: toastId });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Trash2 className="text-red-400" />
          <h3 className="text-xl font-bold text-white">Daily Waste Log</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={formData.log_date}
              onChange={(e) =>
                setFormData({ ...formData, log_date: e.target.value })
              }
              className="p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-red-500/50"
            />
            <select
              value={formData.meal_type}
              onChange={(e) =>
                setFormData({ ...formData, meal_type: e.target.value })
              }
              className="p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-red-500/50"
            >
              <option className="bg-neutral-900">Breakfast</option>
              <option className="bg-neutral-900">Lunch</option>
              <option className="bg-neutral-900">Snacks</option>
              <option className="bg-neutral-900">Dinner</option>
            </select>
          </div>
          <input
            type="number"
            placeholder="Prepared (kg)"
            step="0.1"
            value={formData.total_prepared_kg}
            onChange={(e) =>
              setFormData({
                ...formData,
                total_prepared_kg: parseFloat(e.target.value),
              })
            }
            className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-red-500/50 placeholder:text-slate-600"
          />
          <input
            type="number"
            placeholder="Wasted (kg)"
            step="0.1"
            value={formData.total_waste_kg}
            onChange={(e) =>
              setFormData({
                ...formData,
                total_waste_kg: parseFloat(e.target.value),
              })
            }
            className="w-full p-3 bg-black/20 border border-red-500/30 rounded-xl text-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 placeholder:text-slate-600"
          />
          <input
            type="number"
            placeholder="Student Count"
            value={formData.student_count}
            onChange={(e) =>
              setFormData({
                ...formData,
                student_count: parseInt(e.target.value),
              })
            }
            className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-red-500/50 placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="w-full bg-red-600/80 hover:bg-red-500 text-white p-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)]"
          >
            Log Waste Data
          </button>
        </form>
      </div>

      {/* History Section */}
      <div className="glass-card p-6 rounded-2xl h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <TrendingDown className="text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Recent Logs</h3>
        </div>
        <div className="overflow-y-auto h-[350px] space-y-3 custom-scrollbar pr-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center text-sm hover:bg-white/10 transition-colors"
            >
              <div>
                <p className="font-bold text-slate-200">
                  {log.log_date}{" "}
                  <span className="text-slate-500 font-normal">
                    • {log.meal_type}
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  {log.student_count} Students Served
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-400">
                  {log.total_waste_kg} kg
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Waste
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WasteLog;
