import React from 'react';
import { Salad } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-neutral-800 p-2 rounded-full">
              <Salad className="text-primary" size={24} />
            </div>
            <span className="font-bold text-xl text-white">MessMate</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white">About</a>
            <a href="#" className="hover:text-white">Contact</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-800 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} MessMate. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

