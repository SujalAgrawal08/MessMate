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
      } catch (error) {
        console.error("Failed to fetch full schedule:", error);
      }
    };
    fetchSchedule();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-soft-lg">
      <h2 className="text-2xl font-bold mb-6 text-neutral-900">Full Weekly Menu</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="bg-primary-lightest">
              <th className="p-4 font-semibold text-primary-dark rounded-tl-xl">Day/Meal</th>
              {dayOrder.map(day => (
                <th key={day} className="p-4 font-semibold text-primary-dark">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealOrder.map((meal, index) => (
              <tr key={meal} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                <td className="p-4 font-semibold border-t border-neutral-200">{meal}</td>
                {dayOrder.map(day => (
                  <td key={`${day}-${meal}`} className="p-4 text-sm text-neutral-600 border-t border-neutral-200">
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
