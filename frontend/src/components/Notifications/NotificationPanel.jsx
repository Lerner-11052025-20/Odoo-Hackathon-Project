import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Package, Receipt, Truck, PenTool, ArrowRightLeft, Building2, MapPin, Activity, Check, Trash2, X } from 'lucide-react';

const NotificationPanel = ({ notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification, onClose }) => {
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch(type) {
      case 'LOW_STOCK': return { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20' };
      case 'NEW_PRODUCT': return { icon: Package, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20' };
      case 'RECEIPT_CREATED': return { icon: Receipt, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' };
      case 'DELIVERY_CREATED': return { icon: Truck, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10 border-violet-100 dark:border-violet-500/20' };
      case 'ADJUSTMENT_MADE': return { icon: PenTool, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20' };
      case 'TRANSFER_COMPLETED': return { icon: ArrowRightLeft, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20' };
      case 'WAREHOUSE_CREATED': return { icon: Building2, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-500/10 border-teal-100 dark:border-teal-500/20' };
      case 'LOCATION_ADDED': return { icon: MapPin, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-100 dark:border-cyan-500/20' };
      default: return { icon: Activity, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' };
    }
  };

  const handleCardClick = (notif) => {
    if (!notif.isRead) markAsRead(notif._id);
    
    // Navigate based on related module
    const modules = {
      'stock': '/products',
      'receipts': '/operations/receipts',
      'deliveries': '/operations/deliveries',
      'adjustments': '/operations/adjustments',
      'transfers': '/transfers',
      'warehouses': '/warehouses',
      'locations': '/locations'
    };

    if (modules[notif.relatedModule]) {
      navigate(modules[notif.relatedModule]);
      onClose(); // Close the panel
    }
  };

  const getTimeString = (dateObj) => {
    const minDiff = Math.floor((new Date() - new Date(dateObj)) / 60000);
    if (minDiff < 1) return 'Just now';
    if (minDiff < 60) return `${minDiff}m ago`;
    if (minDiff < 1440) return `${Math.floor(minDiff/60)}h ago`;
    return `${Math.floor(minDiff/1440)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
      className="absolute right-0 top-14 w-full md:w-[420px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden flex flex-col max-h-[80vh] md:max-h-[600px]"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
              {unreadCount} New
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={(e) => { e.stopPropagation(); markAllAsRead(); }} 
              className="px-2 py-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {isLoading && notifications.length === 0 ? (
          <div className="py-12 flex justify-center">
             <span className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
              <Check className="w-8 h-8 text-emerald-400 dark:text-emerald-500/50" />
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">You're all caught up!</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">No new notifications to show right now.</p>
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notif) => {
              const { icon: Icon, color, bg } = getIcon(notif.type);
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  key={notif._id}
                  onClick={() => handleCardClick(notif)}
                  className={`relative p-3 rounded-xl border transition-all cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50 ${notif.isRead ? 'border-transparent bg-transparent opacity-75 grayscale-[20%]' : 'border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-500/5 shadow-sm'}`}
                >
                  {!notif.isRead && <div className="absolute top-4 left-0 w-1 h-10 bg-indigo-500 rounded-r-full" />}
                  
                  <div className="flex gap-3 pl-1">
                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border ${bg} ${color}`}>
                      <Icon size={18} />
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className={`text-[13px] font-bold truncate pr-3 ${notif.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 shrink-0 mt-0.5">
                          {getTimeString(notif.createdAt)}
                        </span>
                      </div>
                      
                      <p className={`text-[12px] leading-tight line-clamp-2 ${notif.isRead ? 'text-slate-500 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'}`}>
                        {notif.message}
                      </p>

                      <div className="mt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
                           View {notif.relatedModule} &rarr;
                         </span>
                         <button 
                           onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                           className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                         >
                           <Trash2 size={12} />
                         </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

    </motion.div>
  );
};

export default NotificationPanel;
