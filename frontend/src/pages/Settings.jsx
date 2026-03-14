import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  MapPin, 
  Layers, 
  Tags, 
  Scale, 
  Bell, 
  Users, 
  Palette,
  ArrowRight
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'inventory_manager';

  const settingLinks = [
    { 
      label: 'Dashboard', 
      path: `/dashboard/${isManager ? 'manager' : 'staff'}`, 
      icon: BarChart3, 
      desc: 'Track real-time inventory metrics and visualize operational data performance indicators.',
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10'
    },
    { 
      label: 'Warehouses', 
      path: '/warehouses', 
      icon: MapPin, 
      desc: 'Configure physical storage facilities and manage distribution center inventory capacity.',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10'
    },
    { 
      label: 'Locations', 
      path: '/locations', 
      icon: Layers, 
      desc: 'Design optimized shelf mapping for precise bin and aisle tracking.',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
    },
    { 
      label: 'Product Categories', 
      path: '/products', 
      icon: Tags, 
      desc: 'Classify inventory into logical groups for simplified reporting and filtering.',
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10'
    },
    { 
      label: 'Units', 
      path: '/products', 
      icon: Scale, 
      desc: 'Standardize measurements for weight, volume, and individual product piece counts.',
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
    },
    { 
      label: 'Notifications', 
      path: '/profile', 
      icon: Bell, 
      desc: 'Automate system alerts for stock levels and critical transaction updates.',
      color: 'text-pink-500 bg-pink-50 dark:bg-pink-500/10'
    },
    { 
      label: 'Users & Roles', 
      path: '/profile', 
      icon: Users, 
      desc: 'Manage platform access permissions for managers and warehouse operations staff.',
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10'
    },
    { 
      label: 'Appearance', 
      path: '/profile', 
      icon: Palette, 
      desc: 'Personalize your workspace visual theme with light and dark modes.',
      color: 'text-primary-500 bg-primary-50 dark:bg-primary-500/10'
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Settings</h1>
          <p className="text-slate-500 mt-2">Configure and manage your inventory ecosystem preferences.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {settingLinks.map((item, idx) => (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                <NavLink 
                  to={item.path}
                  className="flex items-center gap-6 px-8 py-6"
                >
                  {/* Link Part */}
                  <div className="flex items-center gap-4 min-w-[240px]">
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm`}>
                      <item.icon size={24} />
                    </div>
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                      {item.label}
                    </span>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="flex-shrink-0 text-slate-300 dark:text-slate-700 font-light flex items-center gap-2">
                    <div className="h-px w-12 bg-slate-200 dark:bg-slate-800 group-hover:w-16 group-hover:bg-primary-500/30 transition-all duration-300"></div>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Description Part */}
                  <div className="flex-1 lg:pl-4">
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl italic font-medium">
                      {item.desc}
                    </p>
                  </div>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">CoreInventory v1.0.4 • Made with Optimization in Mind</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
