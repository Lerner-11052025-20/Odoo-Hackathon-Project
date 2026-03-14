export const validateLoginId = (value) => {
  if (!value) return 'Login ID is required';
  if (value.length < 6) return 'Login ID must be at least 6 characters';
  if (value.length > 12) return 'Login ID cannot exceed 12 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Login ID can only contain letters, numbers, and underscores';
  return '';
};

export const validateEmail = (value) => {
  if (!value) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(value)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (value) => {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return 'Password must contain at least one special character';
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: '#ef4444', width: '25%' };
  if (score <= 4) return { score, label: 'Fair', color: '#f59e0b', width: '55%' };
  if (score <= 5) return { score, label: 'Good', color: '#3b82f6', width: '75%' };
  return { score, label: 'Strong', color: '#10b981', width: '100%' };
};
