import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useAnalytics = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async (type) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/analytics/${type}`);
      if (data.success) {
        setReportData(data.data);
      }
    } catch (error) {
       toast.error(`Failed to load ${type} analytics`);
    } finally {
      setLoading(false);
    }
  }, []);

  return { reportData, loading, fetchAnalytics };
};
