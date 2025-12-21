import React, { useState } from 'react';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import Login from './components/Login'; 
import { Salad, LayoutDashboard } from 'lucide-react'; 
import { Toaster } from 'react-hot-toast';
import ThreeBackground from './components/ThreeBackground';

function App() {
  const [view, setView] = useState('home'); 

  return (
    <div className="min-h-screen text-slate-200 font-sans relative">
      <ThreeBackground />
      
      {/* Dark Theme Toasts */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default duration
          duration: 3000,
          style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
        }}
      />

      {/* Glass Header */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-[#050505]/60 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 flex justify-between items-center py-4">
          <button onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer group">
            {/* Updated Icon Wrapper */}
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 group-hover:border-cyan-400/50 transition shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <Salad className="text-cyan-400" size={24} /> {/* <--- Salad Icon */}
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Mess<span className="text-cyan-400">Mate</span></h1>
          </button>
          
          {view === 'home' && (
             <button
              onClick={() => setView('dashboard')}
              className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 text-white font-medium px-6 py-2 rounded-full hover:bg-white/10 hover:border-cyan-500/50 transition-all"
            >
              Launch App
            </button>
          )}

          {view === 'dashboard' && (
            <button
             onClick={() => setView('dashboard')}
             className="flex items-center gap-2 bg-cyan-600 text-white font-semibold px-5 py-2 rounded-full shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:bg-cyan-500 transition"
           >
             <LayoutDashboard size={18} />
             Dashboard
           </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 pt-28 pb-12 relative z-10">
        {view === 'home' ? <Home onNavigate={setView} /> : <Dashboard />}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;