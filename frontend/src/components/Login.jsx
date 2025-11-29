import React, { useState } from 'react';
import { loginUser } from '../api';
import { LogIn, Lock, Mail } from 'lucide-react';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(email, password);
      const token = response.data.access_token;
      
      // Save token
      localStorage.setItem('messmate_token', token);
      
      // Decode token roughly to check role (Optional: better to use a library like jwt-decode)
      // For now, we just pass success
      onLoginSuccess();
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-soft-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-lightest p-3 rounded-full">
            <LogIn className="text-primary-dark" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-neutral-900">Admin Login</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-neutral-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-3 bg-neutral-100 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-neutral-400" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 bg-neutral-100 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;