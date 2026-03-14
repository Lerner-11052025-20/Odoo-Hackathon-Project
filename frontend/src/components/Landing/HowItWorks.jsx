import React from 'react';
import { motion } from 'framer-motion';
import { Search, PlusSquare, ArrowLeftRight, ClipboardList, BarChart } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Setup Infrastructure',
      desc: 'Define your warehouse zones, storage locations, and product catalog with technical specifications.',
      icon: PlusSquare
    },
    {
      title: 'Inbound Reception',
      desc: 'Process purchase receipts from suppliers. System automatically updates stock with location-aware placement.',
      icon: ClipboardList
    },
    {
      title: 'Operational Logic',
      desc: 'Execute internal transfers, adjustments, and delivery orders with role-based validation workflows.',
      icon: ArrowLeftRight
    },
    {
      title: 'Analytical Oversight',
      desc: 'Monitor movement leads, low-stock triggers, and warehouse capacity through the unified dashboard.',
      icon: BarChart
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-full aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800" 
                  alt="Warehouse Operations" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating detail card */}
              <div className="absolute -bottom-10 -right-10 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-[240px]">
                <div className="flex items-center gap-2 mb-2">
                  <Search size={16} className="text-primary-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Inventory Sync</span>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">"Items synchronized across 4 warehouses in 0.2s"</p>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 space-y-12">
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                Master Your <span className="gradient-text">Supply Chain</span>
              </h2>
              <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
                From raw materials to customer delivery, manage every stage with surgical precision.
              </p>
            </div>

            <div className="space-y-8">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-lg flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                      <step.icon size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 uppercase tracking-wide">{step.title}</h3>
                    <p className="text-sm font-normal text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
