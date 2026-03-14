import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Download, Database, RefreshCw, Truck, History } from 'lucide-react';

const WorkflowSection = () => {
  const steps = [
    { icon: PlusCircle, title: 'Creation', desc: 'Define products, warehouses, and locations.' },
    { icon: Download, title: 'Reception', desc: 'Receive stock from vendors into warehouses.' },
    { icon: Database, title: 'Storage', desc: 'Organize items in specific bins and racks.' },
    { icon: RefreshCw, title: 'Transfers', desc: 'Move stock between locations seamlessly.' },
    { icon: Truck, title: 'Delivery', desc: 'Fulfill customer orders with real-time updates.' },
    { icon: History, title: 'Traceability', desc: 'Audit every single move in the ledger.' }
  ];

  return (
    <section id="workflow" className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Streamlined <span className="gradient-text">Workflows</span>
          </motion.h2>
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
             Visualize the entire lifecycle of your inventory, from initial setup to final delivery.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 relative">
          {/* Connector lines (decorative) */}
          <div className="hidden lg:block absolute top-[60px] left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 pointer-events-none" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center relative"
            >
              <div className="w-20 h-20 rounded-[30px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl flex items-center justify-center mb-8 relative z-10 group hover:bg-primary-600 transition-colors duration-500">
                 <step.icon size={32} className="text-primary-600 group-hover:text-white transition-colors duration-500" />
                 <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center">
                   {index + 1}
                 </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-sm font-normal text-slate-500 dark:text-slate-400 max-w-[240px]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
