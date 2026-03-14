import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-violet-600/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <div className="relative z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider">Enterprise Inventory Control</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] mb-6"
            >
              Smart <span className="gradient-text">Inventory</span> Management for Modern Teams
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Track stock levels, manage multi-warehouses, monitor product flow, and automate operational workflows in one unified, real-time dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                to="/auth?mode=signup"
                className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl shadow-xl shadow-primary-500/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link
                to="/auth?mode=login"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
              >
                View Live Demo
              </Link>
            </motion.div>

            {/* Quick stats / proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all"
            >
               <div className="flex items-center gap-2">
                 <TrendingUp className="text-primary-600" size={20} />
                 <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">99.9% Accuracy</span>
               </div>
               <div className="flex items-center gap-2">
                 <ShieldCheck className="text-primary-600" size={20} />
                 <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Role-Based Security</span>
               </div>
            </motion.div>
          </div>

          {/* Graphical Element */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-white dark:bg-slate-900 p-4 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 transform rotate-2">
               <img 
                 src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200" 
                 alt="Inventory Dashboard" 
                 className="rounded-[30px] shadow-inner"
               />
               
               {/* Floating elements */}
               <motion.div
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                 className="absolute -top-10 -right-10 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 z-20"
               >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Low Stock Alert</span>
                    <span className="text-sm font-semibold text-rose-500">Aluminum Sheet #4</span>
                  </div>
               </motion.div>

               <motion.div
                 animate={{ y: [20, 0, 20] }}
                 transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                 className="absolute -bottom-10 -left-10 bg-primary-600 p-4 rounded-2xl shadow-xl z-20"
               >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <TrendingUp className="text-white" size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-white/70 uppercase">Total Value</span>
                      <span className="text-sm font-bold text-white">INR248,390.00</span>
                    </div>
                  </div>
               </motion.div>
            </div>
            {/* Outline box */}
            <div className="absolute -inset-4 border-2 border-dashed border-primary-500/30 rounded-[48px] -rotate-3" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
