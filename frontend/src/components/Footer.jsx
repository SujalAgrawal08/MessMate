import React from 'react';
import { Salad } from 'lucide-react';

function Footer() {
  return (
    // Changed background to transparent/glass to show the 3D particles behind it
    <footer className="relative z-10 border-t border-white/5 mt-20 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-cyan-500/10 p-2 rounded-full border border-cyan-500/20">
              <Salad className="text-cyan-400" size={20} />
            </div>
            <span className="font-bold text-xl text-white">
              Mess<span className="text-cyan-400">Mate</span>
            </span>
          </div>
          
          {/* Links Section */}
          <div className="flex gap-6 text-sm text-slate-400 font-medium">
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">About</a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">Contact</a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">Privacy Policy</a>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="mt-8 border-t border-white/5 pt-6 text-center text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} MessMate. Built with AI & React.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;