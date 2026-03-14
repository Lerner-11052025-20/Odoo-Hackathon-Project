import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Package, BarChart3, Truck, ArrowLeftRight, Moon, Sun } from 'lucide-react';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import ForgotPassword from '../components/Auth/ForgotPassword';
import ResetPassword from '../components/Auth/ResetPassword';
import { useTheme } from '../context/ThemeContext';
import { Toaster } from 'react-hot-toast';

const VIEWS = { LOGIN: 'login', SIGNUP: 'signup', FORGOT: 'forgot', RESET: 'reset' };

const features = [
  { icon: Package, label: 'Product Management', desc: 'Track every item with SKU & categories' },
  { icon: Truck, label: 'Receipts & Deliveries', desc: 'Auto stock updates on validation' },
  { icon: ArrowLeftRight, label: 'Internal Transfers', desc: 'Move stock between warehouses' },
  { icon: BarChart3, label: 'Live Dashboard', desc: 'Real-time KPIs and smart alerts' },
];

const AuthPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const [view, setView] = useState(VIEWS.LOGIN);
  const [resetEmail, setResetEmail] = useState('');

  const handleOTPSent = (email) => {
    setResetEmail(email);
    setView(VIEWS.RESET);
  };

  return (
    <div className="min-h-screen flex font-inter bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#f1f5f9' : '#1e293b',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            borderRadius: '12px',
            fontSize: '14px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          },
        }}
      />

      {/* ── LEFT BRAND PANEL ───────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] bg-brand-gradient relative overflow-hidden flex-col justify-between p-12">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="blob absolute -top-24 -left-24 w-80 h-80 bg-violet-500/20" />
          <div className="blob-2 absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400/20" />
          <div className="blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-glow">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">CoreInventory</h1>
              <p className="text-indigo-300 text-xs font-medium">Smart Inventory Management</p>
            </div>
          </motion.div>

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Digitize Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-violet-200">
                Inventory Today
              </span>
            </h2>
            <p className="text-indigo-200/80 text-base leading-relaxed mb-10">
              Replace manual registers and Excel sheets with a centralized, real-time inventory system built for modern businesses.
            </p>
          </motion.div>

          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                  <feature.icon className="w-4 h-4 text-indigo-200" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{feature.label}</p>
                  <p className="text-indigo-300/70 text-xs mt-0.5">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom floating icons */}
        <div className="relative z-10 flex items-end justify-between">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-indigo-300/60 text-xs"
          >
            © 2024 CoreInventory · Indus University Hackathon
          </motion.p>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center float-icon">
              <Package className="w-5 h-5 text-indigo-300/60" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center float-icon-delay">
              <BarChart3 className="w-5 h-5 text-indigo-300/60" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center float-icon-delay-2">
              <Truck className="w-5 h-5 text-indigo-300/60" />
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ───────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-6 lg:p-8">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2">
            <Package className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <span className="font-bold text-slate-900 dark:text-white">CoreInventory</span>
          </div>
          <div className="hidden lg:block" />

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            aria-label="Toggle theme"
          >
            <motion.div
              key={isDark ? 'moon' : 'sun'}
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
            </motion.div>
          </button>
        </div>

        {/* Form Area */}
        <div className="flex-1 flex items-center justify-center px-6 pb-8">
          <div className="w-full max-w-md">
            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-card dark:shadow-card-dark border border-slate-100 dark:border-slate-800 p-8"
            >
              {/* Mobile: Tab Switcher (Login/Signup only) */}
              {(view === VIEWS.LOGIN || view === VIEWS.SIGNUP) && (
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-8">
                  {[VIEWS.LOGIN, VIEWS.SIGNUP].map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        view === v
                          ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      {v === VIEWS.LOGIN ? 'Sign In' : 'Sign Up'}
                    </button>
                  ))}
                </div>
              )}

              {/* Animated Form Views */}
              <AnimatePresence mode="wait">
                {view === VIEWS.LOGIN && (
                  <Login
                    onSwitchToSignup={() => setView(VIEWS.SIGNUP)}
                    onSwitchToForgot={() => setView(VIEWS.FORGOT)}
                  />
                )}
                {view === VIEWS.SIGNUP && (
                  <Signup
                    onSwitchToLogin={() => setView(VIEWS.LOGIN)}
                  />
                )}
                {view === VIEWS.FORGOT && (
                  <ForgotPassword
                    onBack={() => setView(VIEWS.LOGIN)}
                    onOTPSent={handleOTPSent}
                  />
                )}
                {view === VIEWS.RESET && (
                  <ResetPassword
                    email={resetEmail}
                    onBack={() => setView(VIEWS.FORGOT)}
                    onSuccess={() => setView(VIEWS.LOGIN)}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Footer */}
            <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-6">
              Secure authentication powered by JWT · CoreInventory 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
