import { useState, useCallback, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchNotifications = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/notifications?page=${page}&limit=20`);
      const { data, pagination: pag } = res.data;
      
      setNotifications(prev => page === 1 ? data : [...prev, ...data]);
      setPagination(pag);
      
      // Calculate unread count globally if possible, 
      // here we rough estimate based on the fetched data for simplicity, 
      // or we can rely on what the user has not read yet in the full list
      setUnreadCount(data.filter(n => !n.isRead).length); 
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read', { id: 'read-all' });
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification removed', { id: 'del-notif' });
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  // Simple polling for real-time without Socket.io
  useEffect(() => {
    fetchNotifications(1);
    const interval = setInterval(() => {
      fetchNotifications(1);
    }, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};
