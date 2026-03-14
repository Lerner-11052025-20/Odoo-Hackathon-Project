import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import { validatePassword, validateConfirmPassword } from '../../utils/validators';
import toast from 'react-hot-toast';

const ResetPassword = ({ email, onBack, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: OTP, 2: New Password
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDone, setIsDone] = useState(false);

  const otpRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (errors.otp) setErrors({});
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) { setErrors({ otp: 'Please enter the 6-digit OTP' }); return; }

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp: otpCode });
      toast.success('OTP verified! Set your new password.');
      setResetToken(data.resetToken);
      setStep(2);
    } catch (err) {
      toast.error(err.message);
      setErrors({ otp: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {
      newPassword: validatePassword(form.newPassword),
      confirmPassword: validateConfirmPassword(form.newPassword, form.confirmPassword),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        resetToken,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      toast.success(data.message);
      setIsDone(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isDone) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Password Reset! 🎉</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <button onClick={onSuccess} className="btn-primary">Back to Login</button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="reset"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors mb-6">
        <ArrowLeft size={16} /> Back
      </button>

      {step === 1 ? (
        <>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Enter OTP 🔐</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
            We sent a 6-digit code to
          </p>
          <p className="text-primary-600 dark:text-primary-400 font-semibold text-sm mb-8">{email}</p>

          <form onSubmit={handleVerifyOTP}>
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, i) => (
                <motion.input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`otp-input ${errors.otp ? 'border-red-400' : ''}`}
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-center text-xs text-red-500 mb-4">⚠ {errors.otp}</p>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 size={16} className="animate-spin" /> Verifying...</> : 'Verify OTP'}
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">New Password 🔒</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Set a strong new password for your account.
          </p>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showNew ? 'text' : 'password'}
                  value={form.newPassword}
                  onChange={(e) => { setForm(p => ({ ...p, newPassword: e.target.value })); setErrors(p => ({ ...p, newPassword: '' })); }}
                  placeholder="New password"
                  className={`auth-input pl-10 pr-12 ${errors.newPassword ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowNew(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.newPassword && <p className="text-xs text-red-500 mt-1">⚠ {errors.newPassword}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => { setForm(p => ({ ...p, confirmPassword: e.target.value })); setErrors(p => ({ ...p, confirmPassword: '' })); }}
                  placeholder="Confirm new password"
                  className={`auth-input pl-10 pr-12 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">⚠ {errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 size={16} className="animate-spin" /> Resetting...</> : 'Reset Password'}
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default ResetPassword;
