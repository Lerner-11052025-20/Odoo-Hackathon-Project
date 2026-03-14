import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import ProfileCard from '../components/Profile/ProfileCard';
import ChangePasswordForm from '../components/Profile/ChangePasswordForm';
import ProfileActivity from '../components/Profile/ProfileActivity';
import EditProfileForm from '../components/Profile/EditProfileForm';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { profile, activity, isLoading, isUpdating, fetchProfileData, updateProfile, changePassword } = useProfile();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditSubmit = async (data) => {
    const success = await updateProfile(data);
    if (success) setShowEditModal(false);
  };

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-[1600px] mx-auto space-y-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[14px] bg-slate-900 dark:bg-white flex items-center justify-center shadow-sm shrink-0">
              <User size={22} className="text-white dark:text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Profile</h1>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">Manage your account information and security.</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl font-semibold transition-all text-[13px] self-start md:self-auto min-h-[38px]">
            <LogOut size={16} /> Logout Securely
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <span className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Profile Card */}
            <div className="lg:col-span-4 h-full">
               <ProfileCard profile={profile} onEditClick={() => setShowEditModal(true)} />
            </div>

            {/* Middle Col: Change Password */}
            <div className="lg:col-span-4 h-full">
               <ChangePasswordForm onSubmit={changePassword} isUpdating={isUpdating} />
            </div>

            {/* Right Col: Activity Snapshot */}
            <div className="lg:col-span-4 h-full">
               <ProfileActivity activity={activity} />
            </div>

          </div>
        )}
      </motion.div>

      {/* Modals */}
      {showEditModal && (
        <EditProfileForm 
          profile={profile}
          isUpdating={isUpdating}
          onSubmit={handleEditSubmit}
          onCancel={() => setShowEditModal(false)}
        />
      )}

    </MainLayout>
  );
};

export default Profile;
