import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, User, LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import GlobalSearch from './GlobalSearch';
import NotificationBell from '../Notifications/NotificationBell';

const Navbar = ({ onMenuClick, isDesktopOpen, setIsDesktopOpen }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        
        {/* Left Side: Mobile Menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                onMenuClick();
              } else {
                setIsDesktopOpen(!isDesktopOpen);
              }
            }}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <GlobalSearch />
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <NotificationBell />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 pl-2 md:pl-4 border-l border-slate-200 dark:border-slate-700 hover:opacity-80 transition-opacity outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-md">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden md:flex flex-col items-start px-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user?.loginId}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{user?.role?.replace('_', ' ')}</span>
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700/50 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/50 md:hidden block mb-1">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{user?.loginId}</p>
                      <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2">
                       <User size={16} /> Profile Settings
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 mt-1"
                    >
                       <LogOut size={16} /> Log Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
