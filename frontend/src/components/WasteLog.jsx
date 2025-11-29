import React, { useState, useEffect } from 'react';
import { logWaste, getWasteAnalytics } from '../api';
import { Trash2, TrendingDown } from 'lucide-react';

function WasteLog() {
  const [formData, setFormData] = useState({
    log_date: new Date().toISOString().split('T')[0],
    meal_type: 'Lunch',
    total_prepared_kg: '',
    total_waste_kg: '',
    student_count: ''
  });
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await getWasteAnalytics();
      setLogs(res.data.reverse()); // Show newest first
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logWaste(formData);
      setMessage('Waste logged successfully!');
      fetchLogs();
      setFormData({ ...formData, total_prepared_kg: '', total_waste_kg: '', student_count: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to log data. Are you logged in?');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow-soft-lg">
        <div className="flex items-center gap-3 mb-6">
          <Trash2 className="text-primary-dark" />
          <h3 className="text-xl font-bold">Daily Waste Log</h3>
        </div>
        
        {message && <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="date" 
              value={formData.log_date}
              onChange={e => setFormData({...formData, log_date: e.target.value})}
              className="p-3 bg-neutral-100 rounded-xl"
            />
            <select 
              value={formData.meal_type}
              onChange={e => setFormData({...formData, meal_type: e.target.value})}
              className="p-3 bg-neutral-100 rounded-xl"
            >
              <option>Breakfast</option><option>Lunch</option><option>Snacks</option><option>Dinner</option>
            </select>
          </div>
          <input 
            type="number" placeholder="Prepared (kg)" step="0.1"
            value={formData.total_prepared_kg}
            onChange={e => setFormData({...formData, total_prepared_kg: parseFloat(e.target.value)})}
            className="w-full p-3 bg-neutral-100 rounded-xl"
          />
          <input 
            type="number" placeholder="Wasted (kg)" step="0.1"
            value={formData.total_waste_kg}
            onChange={e => setFormData({...formData, total_waste_kg: parseFloat(e.target.value)})}
            className="w-full p-3 bg-neutral-100 rounded-xl border-l-4 border-red-400"
          />
          <input 
            type="number" placeholder="Student Count"
            value={formData.student_count}
            onChange={e => setFormData({...formData, student_count: parseInt(e.target.value)})}
            className="w-full p-3 bg-neutral-100 rounded-xl"
          />
          <button type="submit" className="w-full bg-neutral-900 text-white p-3 rounded-xl font-semibold hover:bg-neutral-700">
            Log Data
          </button>
        </form>
      </div>

      {/* History Section */}
      <div className="bg-white p-6 rounded-2xl shadow-soft-lg overflow-hidden">
         <div className="flex items-center gap-3 mb-6">
          <TrendingDown className="text-primary-dark" />
          <h3 className="text-xl font-bold">Recent Logs</h3>
        </div>
        <div className="overflow-y-auto max-h-[300px] space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="p-3 bg-neutral-50 rounded-lg flex justify-between items-center text-sm">
              <div>
                <p className="font-bold">{log.log_date} <span className="text-neutral-500 font-normal">• {log.meal_type}</span></p>
                <p className="text-xs text-neutral-500">{log.student_count} Students Served</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-500">{log.total_waste_kg} kg</p>
                <p className="text-xs text-neutral-400">Waste</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WasteLog;