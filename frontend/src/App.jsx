import React, { useState } from 'react';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { Salad, LayoutDashboard } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [view, setView] = useState('home'); // 'home' or 'dashboard'

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-700">
      <Toaster position="top-center" reverseOrder={false} />
      <header className="bg-white shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center py-4">
          <button onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer">
            <div className="bg-primary-lightest p-2 rounded-full">
              <Salad className="text-primary-dark" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">MessMate</h1>
          </button>
          
          {view === 'home' && (
             <button
              onClick={() => setView('dashboard')}
              className="hidden md:flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2 rounded-full hover:bg-primary-dark transition"
            >
              Go to Dashboard
            </button>
          )}

          {view === 'dashboard' && (
            <button
             onClick={() => setView('dashboard')}
             className="flex items-center gap-2 bg-primary-lightest text-primary-dark font-semibold px-5 py-2 rounded-full"
           >
             <LayoutDashboard size={18} />
             Dashboard
           </button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        {view === 'home' ? <Home onNavigate={setView} /> : <Dashboard />}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
