import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ForgotPassword = ({ onBack, onOTPSent }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Please enter a valid email'); return; }

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success(data.message || 'OTP sent to your email!');
      onOTPSent(email); // Pass email to Reset page
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      key="forgot"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back button */}
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Login
      </button>

      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
        <Mail className="w-7 h-7 text-primary-600 dark:text-primary-400" />
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Forgot Password?</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
        No worries! Enter your registered email and we'll send you a 6-digit OTP to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="Enter your registered email"
              className={`auth-input pl-10 ${error ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''}`}
            />
          </div>
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1">⚠ {error}</motion.p>
          )}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary flex items-center justify-center gap-2">
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> Sending OTP...</>
          ) : (
            <><Send size={16} /> Send OTP</>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          ⏰ The OTP will expire in <strong>5 minutes</strong>. Check your spam folder if you don't see it.
        </p>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
