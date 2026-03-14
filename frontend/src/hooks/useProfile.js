import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [activity, setActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [profileRes, activityRes] = await Promise.all([
        api.get('/users/profile'),
        api.get('/users/activity')
      ]);
      setProfile(profileRes.data.data);
      setActivity(activityRes.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch profile data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = async (data) => {
    setIsUpdating(true);
    try {
      const res = await api.put('/users/profile', data);
      setProfile(res.data.data);
      toast.success(res.data.message || 'Profile updated successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const changePassword = async (data) => {
    setIsUpdating(true);
    try {
      const res = await api.put('/users/change-password', data);
      toast.success(res.data.message || 'Password changed successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    activity,
    isLoading,
    isUpdating,
    fetchProfileData,
    updateProfile,
    changePassword
  };
};
