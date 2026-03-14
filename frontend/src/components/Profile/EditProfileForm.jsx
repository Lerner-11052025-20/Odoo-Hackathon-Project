import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Mail, Camera } from 'lucide-react';

const EditProfileForm = memo(({ profile, isUpdating, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        avatar: profile.avatar || ''
      });
    }
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onCancel} className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h2>
             <button onClick={onCancel} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
               <X size={18} />
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Camera size={32} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 pl-1"><User size={12}/> Full Name</label>
              <input
                type="text" required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400"
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 pl-1"><Mail size={12}/> Email Address</label>
              <input
                type="email" required
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 pl-1"><Camera size={12}/> Avatar URL</label>
              <input
                type="url" placeholder="https://example.com/avatar.jpg"
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400"
                value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              />
            </div>

            {/* Read-only info */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between px-2">
               <span><strong>Role:</strong> {profile?.role.replace('_', ' ')}</span>
               <span><strong>ID:</strong> {profile?.loginId}</span>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onCancel} className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isUpdating} className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
                {isUpdating ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

EditProfileForm.displayName = 'EditProfileForm';
export default EditProfileForm;
