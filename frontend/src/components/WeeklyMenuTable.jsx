import React, { useState, useEffect } from 'react';
import { getFullMenuSchedule } from '../api';

const mealOrder = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function WeeklyMenuTable() {
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await getFullMenuSchedule();
        setSchedule(response.data);
      } catch (error) { console.error(error); }
    };
    fetchSchedule();
  }, []);

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-white">Full Weekly Schedule</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr>
              <th className="p-4 font-semibold text-cyan-400 border-b border-white/10">Meal</th>
              {dayOrder.map(day => (
                <th key={day} className="p-4 font-semibold text-cyan-400 border-b border-white/10">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealOrder.map((meal) => (
              <tr key={meal} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-semibold text-slate-200 border-b border-white/5">{meal}</td>
                {dayOrder.map(day => (
                  <td key={`${day}-${meal}`} className="p-4 text-sm text-slate-400 border-b border-white/5">
                    {schedule[day] && schedule[day][meal] ? schedule[day][meal].join(', ') : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WeeklyMenuTable;