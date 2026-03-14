import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useDashboardData = () => {
  const [kpis, setKpis] = useState(null);
  const [activity, setActivity] = useState(null);
  const [recentOperations, setRecentOperations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Optimize: Fetch all data concurrently using Promise.all
        const [kpiRes, activityRes, operationsRes] = await Promise.all([
          api.get('/dashboard/kpis'),
          api.get('/dashboard/activity'),
          api.get('/dashboard/recent-operations')
        ]);

        if (isMounted) {
          setKpis(kpiRes.data.data);
          setActivity(activityRes.data.data);
          setRecentOperations(operationsRes.data.data);
        }
      } catch (error) {
        if (isMounted) toast.error('Failed to load dashboard data');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { kpis, activity, recentOperations, isLoading };
};
