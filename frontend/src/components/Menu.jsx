import React, { useState, useEffect } from 'react';
import { getTodaysMenu, addMenuItem } from '../api';
import WeeklyMenuTable from './WeeklyMenuTable';
import { Flame, Wheat, Beef, Drumstick } from 'lucide-react';

const NutritionIcon = ({ type }) => {
  const icons = {
    protein: <Drumstick size={16} className="text-red-500" />,
    carbs: <Wheat size={16} className="text-yellow-500" />,
    fats: <Flame size={16} className="text-orange-500" />,
  };
  return icons[type] || null;
};

const MealCard = ({ title, items }) => (
  <div className="bg-white p-6 rounded-2xl shadow-soft">
    <h3 className="font-bold text-xl mb-4 text-neutral-900">{title}</h3>
    <div className="space-y-4">
      {items && items.length > 0 ? items.map(item => (
        <div key={item.id} className="border-b border-neutral-100 pb-3 last:border-b-0">
          <p className="font-semibold text-neutral-800">{item.item_name}</p>
          <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500">
            <span>{item.calories} kcal</span>
            <span className="flex items-center gap-1"><NutritionIcon type="protein" /> {item.protein}g P</span>
            <span className="flex items-center gap-1"><NutritionIcon type="carbs" /> {item.carbs}g C</span>
            <span className="flex items-center gap-1"><NutritionIcon type="fats" /> {item.fats}g F</span>
          </div>
        </div>
      )) : <p className="text-sm text-neutral-400">No items scheduled for this meal.</p>}
    </div>
  </div>
);

function Menu() {
  const [todaysMenu, setTodaysMenu] = useState({});
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await getTodaysMenu();
        if (response.data && !response.data.message) {
          setTodaysMenu(response.data);
        }
      } catch (error) {
        console.error("Error fetching today's menu:", error);
      }
    };
    fetchMenu();
  }, []);

  return (
    <div className="space-y-12">
      {/* Today's Menu Section */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Menu for {today}</h2>
        <p className="text-neutral-500 mb-6">Here’s what’s being served today, along with nutritional information.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MealCard title="Breakfast" items={todaysMenu.Breakfast} />
          <MealCard title="Lunch" items={todaysMenu.Lunch} />
          <MealCard title="Snacks" items={todaysMenu.Snacks} />
          <MealCard title="Dinner" items={todaysMenu.Dinner} />
        </div>
      </div>
      
      {/* Weekly Schedule Section */}
      <WeeklyMenuTable />
    </div>
  );
}

export default Menu;
