import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-[60px] bg-gradient-to-br from-primary-600 to-indigo-700 p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary-500/30">
          
          {/* Animated decorative circles */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full -translate-y-1/2 translate-x-1/2"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white rounded-full translate-y-1/2 -translate-x-1/2"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <Zap className="w-4 h-4 text-primary-200" />
              <span className="text-xs font-bold text-primary-50 uppercase tracking-wider">Join +500 Companies</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight">
              Ready to Control Your <span className="italic underline decoration-primary-300 decoration-8 underline-offset-8">Stock</span> Flow?
            </h2>
            <p className="text-lg sm:text-xl font-medium text-primary-100 mb-12 max-w-xl mx-auto opacity-80">
               Modernize your warehouse operations today. No credit card required. Fast deployment guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth?mode=signup"
                className="w-full sm:w-auto px-10 py-5 bg-white text-primary-700 font-semibold rounded-2xl shadow-2xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 text-sm flex items-center justify-center gap-2"
              >
                Create Free Account <ArrowRight size={18} />
              </Link>
              <Link
                to="/auth?mode=login"
                className="w-full sm:w-auto px-10 py-5 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-sm border border-primary-500/50 flex items-center justify-center gap-2"
              >
                Speak to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
