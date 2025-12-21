import React, { useState, useEffect } from 'react';
import { getTodaysMenu } from '../api';
import WeeklyMenuTable from './WeeklyMenuTable';
import { Flame, Wheat, Drumstick } from 'lucide-react';

// Helper to calculate totals
const calculateMealTotals = (items) => {
  if (!items || items.length === 0) return null;
  return items.reduce((acc, item) => ({
    calories: acc.calories + (item.calories || 0),
    protein: acc.protein + (item.protein || 0),
    carbs: acc.carbs + (item.carbs || 0),
    fats: acc.fats + (item.fats || 0),
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
};

const MealCard = ({ title, items }) => {
  const totals = calculateMealTotals(items);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full hover:bg-white/5 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/5 p-4 border-b border-white/5">
        <h3 className="font-bold text-lg text-cyan-400 mb-2 tracking-wide">{title}</h3>
        
        {totals ? (
          <div className="flex flex-wrap gap-2 text-xs font-bold">
             <span className="bg-orange-500/10 text-orange-400 px-2 py-1 rounded border border-orange-500/20 flex items-center gap-1">
               <Flame size={10} /> {totals.calories} kcal
             </span>
             <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20 flex items-center gap-1">
               P: {totals.protein.toFixed(0)}g
             </span>
             <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1">
               C: {totals.carbs.toFixed(0)}g
             </span>
          </div>
        ) : (
           <span className="text-xs text-slate-500">No Data</span>
        )}
      </div>

      {/* List */}
      <div className="p-4 space-y-3 flex-1">
        {items && items.length > 0 ? items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start text-sm group">
            <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{item.item_name}</span>
            <div className="text-xs text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity">
                {item.calories} cal
            </div>
          </div>
        )) : (
          <p className="text-sm text-slate-600 italic">Kitchen Closed</p>
        )}
      </div>
    </div>
  );
};

function Menu() {
  const [todaysMenu, setTodaysMenu] = useState({});
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await getTodaysMenu();
        if (response.data) setTodaysMenu(response.data);
      } catch (error) { console.error("Error fetching menu:", error); }
    };
    fetchMenu();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Today's Menu */}
      <div>
        <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-white">Live Menu: {today}</h2>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
        </div>
        <p className="text-slate-400 mb-8">
            Real-time nutritional breakdown. 
            <span className="font-semibold text-cyan-400"> Items Loaded: {Object.values(todaysMenu).flat().length}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MealCard title="Breakfast" items={todaysMenu.Breakfast} />
          <MealCard title="Lunch" items={todaysMenu.Lunch} />
          <MealCard title="Snacks" items={todaysMenu.Snacks} />
          <MealCard title="Dinner" items={todaysMenu.Dinner} />
        </div>
      </div>
      
      <WeeklyMenuTable />
    </div>
  );
}

export default Menu;