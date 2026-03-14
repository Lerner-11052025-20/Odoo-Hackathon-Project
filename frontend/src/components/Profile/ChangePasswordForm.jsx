import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Key, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ChangePasswordForm = memo(({ onSubmit, isUpdating }) => {
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [validation, setValidation] = useState({
    length: false,
    upper: false,
    lower: false,
    special: false,
    match: false
  });

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setPassForm({ ...passForm, newPassword: newPass });
    
    setValidation({
      length: newPass.length >= 8,
      upper: /[A-Z]/.test(newPass),
      lower: /[a-z]/.test(newPass),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPass),
      match: newPass === passForm.confirmNewPassword && newPass !== ''
    });
  };

  const handleConfirmChange = (e) => {
    const confirmPass = e.target.value;
    setPassForm({ ...passForm, confirmNewPassword: confirmPass });
    setValidation(prev => ({
      ...prev,
      match: passForm.newPassword === confirmPass && confirmPass !== ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validation.length || !validation.upper || !validation.lower || !validation.special || !validation.match) {
      return; // Handled by disabled button, but double check
    }
    const success = await onSubmit(passForm);
    if (success) {
      setPassForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setValidation({ length: false, upper: false, lower: false, special: false, match: false });
    }
  };

  const isValid = Object.values(validation).every(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-100 dark:border-amber-500/20">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account Security</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Update your password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        <div>
           <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Current Password</label>
           <div className="relative">
             <Key size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
             <input
               type="password" required
               className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-400"
               value={passForm.currentPassword} onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
             />
           </div>
        </div>
        
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
           <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 pl-1">New Password</label>
           <div className="relative">
             <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
             <input
               type="password" required
               className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-400"
               value={passForm.newPassword} onChange={handlePasswordChange}
             />
           </div>
        </div>

        <div>
           <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 pl-1">Confirm New Password</label>
           <div className="relative">
             <CheckCircle2 size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${validation.match ? 'text-emerald-500' : 'text-slate-400'}`} />
             <input
               type="password" required
               className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-400"
               value={passForm.confirmNewPassword} onChange={handleConfirmChange}
             />
           </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1 mt-2 flex-grow">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Password Requirements:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
             <div className={`flex items-center gap-1.5 ${validation.length ? 'text-emerald-500' : 'text-slate-400'}`}><div className={`w-1.5 h-1.5 rounded-full ${validation.length ? 'bg-emerald-500' : 'bg-slate-300'}`}/> 8+ Characters</div>
             <div className={`flex items-center gap-1.5 ${validation.upper ? 'text-emerald-500' : 'text-slate-400'}`}><div className={`w-1.5 h-1.5 rounded-full ${validation.upper ? 'bg-emerald-500' : 'bg-slate-300'}`}/> 1 Uppercase</div>
             <div className={`flex items-center gap-1.5 ${validation.lower ? 'text-emerald-500' : 'text-slate-400'}`}><div className={`w-1.5 h-1.5 rounded-full ${validation.lower ? 'bg-emerald-500' : 'bg-slate-300'}`}/> 1 Lowercase</div>
             <div className={`flex items-center gap-1.5 ${validation.special ? 'text-emerald-500' : 'text-slate-400'}`}><div className={`w-1.5 h-1.5 rounded-full ${validation.special ? 'bg-emerald-500' : 'bg-slate-300'}`}/> 1 Special Char</div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!isValid || isUpdating} 
          className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isUpdating ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Update Password'}
        </button>
      </form>
    </motion.div>
  );
});

ChangePasswordForm.displayName = 'ChangePasswordForm';
export default ChangePasswordForm;
