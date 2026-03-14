import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = ({ onSwitchToSignup, onSwitchToForgot }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ loginId: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.loginId.trim()) newErrors.loginId = 'Login ID is required';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const user = await login(form.loginId.trim(), form.password);
      // Redirect based on role
      if (user.role === 'inventory_manager') {
        navigate('/dashboard/manager');
      } else {
        navigate('/dashboard/staff');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid Login ID or Password');
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back 👋</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Sign in to your CoreInventory account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Login ID */}
        <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
            Login ID
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="loginId"
              value={form.loginId}
              onChange={handleChange}
              placeholder="Enter your Login ID"
              className={`auth-input pl-10 ${errors.loginId ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''}`}
              autoComplete="username"
            />
          </div>
          {errors.loginId && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1 flex items-center gap-1"
            >
              ⚠ {errors.loginId}
            </motion.p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`auth-input pl-10 pr-12 ${errors.password ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''}`}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1"
            >
              ⚠ {errors.password}
            </motion.p>
          )}
        </motion.div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSwitchToForgot}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Forgot Password?
          </button>
        </div>

        {/* General Error */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
          >
            <span>⚠</span> {errors.general}
          </motion.div>
        )}

        {/* Submit */}
        <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible">
          <button type="submit" disabled={isLoading} className="btn-primary flex items-center justify-center gap-2">
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Signing in...</>
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </motion.div>
      </form>

      {/* Switch to Signup */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToSignup}
          className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
        >
          Sign Up
        </button>
      </p>
    </motion.div>
  );
};

export default Login;
