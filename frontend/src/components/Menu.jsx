// import React, { useState, useEffect } from 'react';
// import { getTodaysMenu, addMenuItem } from '../api';
// import WeeklyMenuTable from './WeeklyMenuTable';
// import { Flame, Wheat, Beef, Drumstick } from 'lucide-react';

// const NutritionIcon = ({ type }) => {
//   const icons = {
//     protein: <Drumstick size={16} className="text-red-500" />,
//     carbs: <Wheat size={16} className="text-yellow-500" />,
//     fats: <Flame size={16} className="text-orange-500" />,
//   };
//   return icons[type] || null;
// };

// const MealCard = ({ title, items }) => (
//   <div className="bg-white p-6 rounded-2xl shadow-soft">
//     <h3 className="font-bold text-xl mb-4 text-neutral-900">{title}</h3>
//     <div className="space-y-4">
//       {items && items.length > 0 ? items.map(item => (
//         <div key={item.id} className="border-b border-neutral-100 pb-3 last:border-b-0">
//           <p className="font-semibold text-neutral-800">{item.item_name}</p>
//           <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500">
//             <span>{item.calories} kcal</span>
//             <span className="flex items-center gap-1"><NutritionIcon type="protein" /> {item.protein}g P</span>
//             <span className="flex items-center gap-1"><NutritionIcon type="carbs" /> {item.carbs}g C</span>
//             <span className="flex items-center gap-1"><NutritionIcon type="fats" /> {item.fats}g F</span>
//           </div>
//         </div>
//       )) : <p className="text-sm text-neutral-400">No items scheduled for this meal.</p>}
//     </div>
//   </div>
// );

// function Menu() {
//   const [todaysMenu, setTodaysMenu] = useState({});
//   const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         const response = await getTodaysMenu();
//         if (response.data && !response.data.message) {
//           setTodaysMenu(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching today's menu:", error);
//       }
//     };
//     fetchMenu();
//   }, []);

//   return (
//     <div className="space-y-12">
//       {/* Today's Menu Section */}
//       <div>
//         <h2 className="text-3xl font-bold mb-2">Menu for {today}</h2>
//         <p className="text-neutral-500 mb-6">Here’s what’s being served today, along with nutritional information.</p>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <MealCard title="Breakfast" items={todaysMenu.Breakfast} />
//           <MealCard title="Lunch" items={todaysMenu.Lunch} />
//           <MealCard title="Snacks" items={todaysMenu.Snacks} />
//           <MealCard title="Dinner" items={todaysMenu.Dinner} />
//         </div>
//       </div>
      
//       {/* Weekly Schedule Section */}
//       <WeeklyMenuTable />
//     </div>
//   );
// }

// export default Menu;


import React, { useState, useEffect } from 'react';
import { getTodaysMenu } from '../api';
import WeeklyMenuTable from './WeeklyMenuTable';
import { Flame, Wheat, Beef, Drumstick, Calculator } from 'lucide-react';

const NutritionIcon = ({ type }) => {
  const icons = {
    protein: <Drumstick size={14} className="text-red-500" />,
    carbs: <Wheat size={14} className="text-yellow-500" />,
    fats: <Flame size={14} className="text-orange-500" />,
  };
  return icons[type] || null;
};

// Helper to calculate total macros for a specific meal (e.g., Lunch)
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
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden flex flex-col h-full border border-neutral-100">
      {/* Header with Totals */}
      <div className="bg-primary-lightest/30 p-4 border-b border-neutral-100">
        <h3 className="font-bold text-lg text-neutral-900 mb-2">{title}</h3>
        
        {totals ? (
          <div className="flex flex-wrap gap-3 text-xs font-bold text-neutral-600">
             <span className="bg-white px-2 py-1 rounded-md shadow-sm border border-neutral-100 flex items-center gap-1">
               🔥 {totals.calories} kcal
             </span>
             <span className="bg-white px-2 py-1 rounded-md shadow-sm border border-neutral-100 flex items-center gap-1 text-red-600">
               P: {totals.protein.toFixed(1)}g
             </span>
             <span className="bg-white px-2 py-1 rounded-md shadow-sm border border-neutral-100 flex items-center gap-1 text-yellow-600">
               C: {totals.carbs.toFixed(1)}g
             </span>
          </div>
        ) : (
           <span className="text-xs text-neutral-400">0 kcal</span>
        )}
      </div>

      {/* List of Items */}
      <div className="p-4 space-y-3 flex-1">
        {items && items.length > 0 ? items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start text-sm group">
            <span className="font-medium text-neutral-700">{item.item_name}</span>
            <div className="text-xs text-neutral-400 opacity-50 group-hover:opacity-100 transition-opacity flex gap-2">
                <span>{item.calories} cal</span>
                {/* Optional: Show individual macros on hover if needed */}
            </div>
          </div>
        )) : (
          <p className="text-sm text-neutral-400 italic">No items added yet.</p>
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
      {/* Today's Menu Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-neutral-800">Menu for {today}</h2>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Live</span>
        </div>
        <p className="text-neutral-500 mb-8">
            Detailed breakdown of today's nutrition. 
            <span className="font-semibold text-primary"> Total items: {
                Object.values(todaysMenu).flat().length
            }</span>
        </p>

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
