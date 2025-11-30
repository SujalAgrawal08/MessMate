import React from 'react';
import { ChevronRight, Zap, Target, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

// High-quality thematic image
const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1887&auto=format&fit=crop";

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-all cursor-default text-left border border-white/5"
    >
      <div className="bg-cyan-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-cyan-500/20">
        <Icon className="text-cyan-400" size={24} />
      </div>
      <h3 className="font-bold text-xl mb-2 text-white">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

function Home({ onNavigate }) {
  return (
    <div className="relative z-10 text-white space-y-24 py-10">
      
      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[60vh]">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left space-y-8 relative z-20"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold tracking-widest uppercase">
            Welcome To
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Campus Dining.
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Optimize mess operations with predictive analytics, real-time waste tracking, and automated inventory management.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="group bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-full transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
            >
              Get Started 
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
        
        {/* Right Image Section - UPDATED SIZING */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block relative z-10"
        >
          {/* Updates made here:
              1. w-full: Takes full width of the column
              2. h-[380px]: Restricts height to look like a wide banner (matching your screenshot)
              3. rounded-[2rem]: Matches the rounded corners in your image
          */}
          <div className="relative w-full h-[380px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group">
            
            <img 
              src={HERO_IMAGE_URL} 
              alt="Future of food technology" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Gradient Overlay for blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-40"></div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="text-center">
        <motion.h2 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="text-3xl font-bold mb-16"
        >
          Intelligent Features
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Zap} 
            title="Instant Analytics" 
            description="Real-time sentiment analysis engine processes student feedback instantly."
            delay={0.2}
          />
          <FeatureCard 
            icon={Leaf} 
            title="Smart Nutrition" 
            description="Automated macro-nutrient calculation for every meal on the menu."
            delay={0.4}
          />
          <FeatureCard 
            icon={Target} 
            title="Predictive AI" 
            description="Forecast demand with 90% accuracy using historical data models."
            delay={0.6}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;