import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, User, Shield, Calendar, Clock } from 'lucide-react';

const ProfileCard = memo(({ profile, onEditClick }) => {
  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden h-full"
    >
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/20 to-blue-500/10 dark:from-indigo-500/10 dark:to-blue-500/5" />
      
      <div className="relative flex flex-col items-center mt-8">
        <div className="relative group mb-4">
          <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-800 p-1.5 shadow-md border border-slate-100 dark:border-slate-700">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <div className="w-full h-full rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                <span className="text-4xl font-black">{profile.name?.charAt(0) || 'U'}</span>
              </div>
            )}
          </div>
          <button onClick={onEditClick} className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors group-hover:scale-110">
            <Camera size={16} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{profile.name}</h2>
        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-lg mb-6">
          {profile.role.replace('_', ' ')}
        </span>

        <div className="w-full space-y-4">
          <div className="flex items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <User size={18} className="text-slate-400 mr-3" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Login ID</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{profile.loginId}</span>
            </div>
          </div>
          
          <div className="flex items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <Mail size={18} className="text-slate-400 mr-3" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Email Address</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{profile.email}</span>
            </div>
          </div>

          <div className="flex items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <Calendar size={18} className="text-slate-400 mr-3" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Member Since</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProfileCard.displayName = 'ProfileCard';
export default ProfileCard;
