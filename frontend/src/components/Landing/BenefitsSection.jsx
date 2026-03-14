import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Users, Zap, ShieldCheck } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    { icon: CheckCircle2, title: '99% Error Reduction', desc: 'Automated validation prevents stock discrepancies.' },
    { icon: TrendingUp, title: 'Sales Efficiency', desc: 'Faster delivery fulfillment cycles with real-time data.' },
    { icon: Users, title: 'Seamless Collaboration', desc: 'Managers and staff work together in a unified environment.' },
    { icon: Zap, title: 'Immediate Insights', desc: 'Predictive low-stock alerts and history analytics.' },
    { icon: ShieldCheck, title: 'Enterprise Audit Trail', desc: 'Detailed Move History Ledger for high-stakes compliance.' }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 dark:bg-slate-800/40 rounded-[60px] py-16 px-8 md:px-16 overflow-hidden relative shadow-2xl">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#primary,transparent_40%)]" />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl font-bold text-white mb-8 tracking-tight"
              >
                Why Leaders <span className="text-primary-400">Choose</span> CoreInventory
              </motion.h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shrink-0 mt-1">
                      <benefit.icon size={14} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white leading-tight">{benefit.title}</h4>
                      <p className="text-sm font-normal text-slate-400">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative flex justify-center"
            >
              <div className="w-full max-w-md aspect-square bg-gradient-to-br from-primary-600/30 to-violet-600/30 border border-white/10 rounded-full flex items-center justify-center relative p-8">
                  <div className="w-full h-full bg-slate-900/50 backdrop-blur-xl border border-white/20 rounded-full flex flex-col items-center justify-center text-center p-12 shadow-inner">
                    <span className="text-6xl font-extrabold text-primary-400 mb-2 tracking-tight italic">+40%</span>
                    <span className="text-xl font-semibold text-white uppercase tracking-wider leading-none">Operation Speed</span>
                    <p className="mt-4 text-xs font-medium text-slate-500 max-w-[200px]">Average improvement reported by teams after switching to CoreInventory.</p>
                  </div>
                  
                  {/* Glowing rings */}
                  <div className="absolute inset-0 border border-primary-500/20 rounded-full animate-ping pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
