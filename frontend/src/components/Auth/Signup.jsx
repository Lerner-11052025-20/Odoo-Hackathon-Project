import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Lock, ChevronDown, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  validateLoginId,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  getPasswordStrength,
} from '../../utils/validators';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'inventory_manager', label: '📊 Inventory Manager', desc: 'Manage stock, receipts & deliveries' },
  { value: 'warehouse_staff', label: '🏭 Warehouse Staff', desc: 'Transfers, picking & counting' },
];

const Signup = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    loginId: '', email: '', password: '', confirmPassword: '', role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const selectRole = (value) => {
    setForm(prev => ({ ...prev, role: value }));
    setShowRoleDropdown(false);
    if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
  };

  const validate = () => {
    const newErrors = {
      loginId: validateLoginId(form.loginId),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
      role: form.role ? '' : 'Please select a role',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'inventory_manager') {
        navigate('/dashboard/manager');
      } else {
        navigate('/dashboard/staff');
      }
    } catch (err) {
      toast.error(err.message);
      setErrors(prev => ({ ...prev, general: err.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRole = ROLES.find(r => r.value === form.role);

  const inputVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } }),
  };

  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account 🚀</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Join CoreInventory and streamline your inventory
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Login ID */}
        <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
            Login ID <span className="text-slate-400 normal-case font-normal">(6–12 chars)</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="loginId"
              value={form.loginId}
              onChange={handleChange}
              placeholder="e.g. manager01"
              maxLength={12}
              className={`auth-input pl-10 ${errors.loginId ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''}`}
            />
            {form.loginId && !errors.loginId && form.loginId.length >= 6 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">✓</span>
            )}
          </div>
          {errors.loginId && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1">⚠ {errors.loginId}</motion.p>
          )}
        </motion.div>

        {/* Email */}
        <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`auth-input pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''}`}
            />
          </div>
          {errors.email && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1">⚠ {errors.email}</motion.p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible">
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
              placeholder="Min. 8 chars with A, a, @"
              className={`auth-input pl-10 pr-12 ${errors.password ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : ''}`}
            />
            <button type="button" onClick={() => setShowPassword(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* Password Strength Bar */}
          {form.password && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-500">Strength</span>
                <span className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: strength.color }}
                  initial={{ width: 0 }}
                  animate={{ width: strength.width }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}
          {errors.password && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1">⚠ {errors.password}</motion.p>
          )}
        </motion.div>

        {/* Confirm Password */}
        <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
            Re-Enter Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={`auth-input pl-10 pr-12 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400' : form.confirmPassword && form.password === form.confirmPassword ? 'border-emerald-400' : ''}`}
            />
            <button type="button" onClick={() => setShowConfirm(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1">⚠ {errors.confirmPassword}</motion.p>
          )}
          {form.confirmPassword && form.password === form.confirmPassword && (
            <p className="text-xs text-emerald-500 mt-1">✓ Passwords match</p>
          )}
        </motion.div>

        {/* Role Selection */}
        <motion.div custom={4} variants={inputVariants} initial="hidden" animate="visible">
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
            Select Role
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleDropdown(p => !p)}
              className={`auth-input text-left flex items-center justify-between cursor-pointer ${errors.role ? 'border-red-400' : ''} ${!selectedRole ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}
            >
              <span>{selectedRole ? selectedRole.label : 'Choose your role...'}</span>
              <ChevronDown size={16} className={`transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showRoleDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
              >
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => selectRole(role.value)}
                    className={`w-full text-left px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0 ${form.role === role.value ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                  >
                    <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{role.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{role.desc}</div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          {errors.role && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-500 mt-1">⚠ {errors.role}</motion.p>
          )}
        </motion.div>

        {/* General Error */}
        {errors.general && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3 text-sm text-red-600 dark:text-red-400">
            ⚠ {errors.general}
          </motion.div>
        )}

        {/* Submit */}
        <motion.div custom={5} variants={inputVariants} initial="hidden" animate="visible">
          <button type="submit" disabled={isLoading} className="btn-primary flex items-center justify-center gap-2">
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Creating account...</>
            ) : (
              <>Create Account <ArrowRight size={16} /></>
            )}
          </button>
        </motion.div>
      </form>

      {/* Switch to Login */}
      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin}
          className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          Sign In
        </button>
      </p>
    </motion.div>
  );
};

export default Signup;
