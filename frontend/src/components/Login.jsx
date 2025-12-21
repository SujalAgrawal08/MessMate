import React, { useState } from 'react';
import { loginUser } from '../api';
import { LogIn, Lock, Mail, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Authenticating...');

    try {
      const response = await loginUser(email, password);
      localStorage.setItem('messmate_token', response.data.access_token);
      toast.success('Access Granted', { id: toastId });
      onLoginSuccess();
    } catch (err) {
      toast.error('Invalid Credentials', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center relative z-10">
      {/* The Cyber Glass Card */}
      <div className="glass-card p-10 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
        
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]" />

        <div className="flex justify-center mb-8">
          <div className="bg-cyan-500/10 p-5 rounded-2xl border border-cyan-500/20">
            <LogIn className="text-cyan-400" size={32} />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 text-white">Welcome Back</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Secure Portal Login</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-cyan-500 ml-1 tracking-wider">EMAIL ID</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 bg-black/20 border border-white/10 rounded-xl focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-white placeholder:text-slate-600"
                placeholder="user@messmate.in"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
             <label className="text-xs font-bold text-cyan-500 ml-1 tracking-wider">PASSWORD</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 p-3 bg-black/20 border border-white/10 rounded-xl focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-white placeholder:text-slate-600"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2 group"
          >
            {loading ? 'Processing...' : 'Sign In'}
            {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition" />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;