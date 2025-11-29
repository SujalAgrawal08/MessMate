import React, { useState } from 'react';
import Menu from './Menu';
import Feedback from './Feedback';
import Chart from './Chart';

const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors ${
      isActive ? 'bg-white text-primary-dark shadow-soft' : 'text-neutral-500 hover:text-neutral-900'
    }`}
  >
    {label}
  </button>
);

function Dashboard() {
  const [activeTab, setActiveTab] = useState('feedback');

  return (
    <div>
      <div className="flex justify-center mb-8">
        <nav className="flex items-center gap-4 bg-neutral-100 p-2 rounded-full">
          <TabButton
            label="Feedback & Analysis"
            isActive={activeTab === 'feedback'}
            onClick={() => setActiveTab('feedback')}
          />
          <TabButton
            label="Menu Management"
            isActive={activeTab === 'menu'}
            onClick={() => setActiveTab('menu')}
          />
        </nav>
      </div>

      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"><Feedback /></div>
          <div><Chart /></div>
        </div>
      )}
      {activeTab === 'menu' && <Menu />}
    </div>
  );
}

export default Dashboard;

