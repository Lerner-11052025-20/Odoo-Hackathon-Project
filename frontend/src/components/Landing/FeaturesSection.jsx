import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Truck, History, Smartphone, Shield, Zap, Package, MapPin } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Package,
      title: 'Stock Tracking',
      desc: 'Monitor real-time product quantities across all warehouses with SKU-level precision.',
      color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    },
    {
      icon: MapPin,
      title: 'Warehouse Control',
      desc: 'Manage multiple physical locations and storage racks with organized hierarchies.',
      color: 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400'
    },
    {
      icon: Truck,
      title: 'Inbound / Outbound',
      desc: 'Seamlessly process Receipts and Delivery Orders with automated inventory induction.',
      color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    },
    {
      icon: History,
      title: 'Audit Ledger',
      desc: 'Full move history traceability. Every internal transfer and adjustment is tracked.',
      color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
    },
    {
      icon: Zap,
      title: 'Smart Alerts',
      desc: 'Dynamic notifications for low stock, validated receipts, and inventory shortages.',
      color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
    },
    {
      icon: Shield,
      title: 'Secure Access',
      desc: 'Enterprise-grade role-based access control (RBAC) for Managers and Staff users.',
      color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Built for <span className="gradient-text">Scalable</span> Operations
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg font-medium text-slate-500 dark:text-slate-400"
          >
            The comprehensive feature set you need to eliminate inventory silos and optimize the flow of your goods from vendor to customer.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Decorative background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-100/50 dark:bg-primary-500/5 blur-[100px] rounded-full pointer-events-none" />

          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-[32px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-500/30 transition-all hover:shadow-2xl hover:shadow-primary-500/10 relative z-10"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${feature.color}`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
