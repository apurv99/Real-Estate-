import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { motion } from 'motion/react';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if the email is the admin email
      if (email !== 'apurvhazra99@gmail.com') {
        throw new Error('Access denied. You are not authorized to access the admin panel.');
      }

      await signInWithEmailAndPassword(auth, email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 -skew-x-12 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gold/5 skew-x-12 -translate-x-1/2"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-sm shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-10">
          <div className="flex items-center justify-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-navy flex items-center justify-center rounded-sm">
              <span className="text-white font-serif text-2xl font-bold">V</span>
            </div>
            <div className="flex flex-col">
              <span className="text-navy font-serif text-xl font-bold leading-none tracking-tight">VANGUARD</span>
              <span className="text-gold text-[10px] uppercase tracking-[0.2em] leading-none mt-1">ADMIN PANEL</span>
            </div>
          </div>

          <h2 className="text-2xl font-serif text-navy mb-2 text-center">Welcome Back</h2>
          <p className="text-slate-400 text-sm text-center mb-10">Please enter your credentials to access the dashboard.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start space-x-3">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <p className="text-xs text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <Mail size={12} className="mr-2" /> Email Address
              </label>
              <input 
                required
                type="email" 
                className="w-full border-b border-slate-200 py-3 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="admin@vanguardestates.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold flex items-center">
                <Lock size={12} className="mr-2" /> Password
              </label>
              <input 
                required
                type="password" 
                className="w-full border-b border-slate-200 py-3 focus:outline-none focus:border-gold text-sm transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-navy text-white text-xs uppercase tracking-widest font-bold hover:bg-gold transition-all duration-300 shadow-lg shadow-navy/20 disabled:bg-navy/50 disabled:cursor-not-allowed flex items-center justify-center group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Login to Dashboard
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
            Authorized Personnel Only. <br />
            All access attempts are logged and monitored.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
