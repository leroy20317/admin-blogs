import { useState, useCallback } from 'react';
import { fetchDashboard } from '@/services/common';

export default function useDashboardModel() {
  const [info, setInfo] = useState<API.Dashboard>();
  const [loading, setLoading] = useState(true);

  const getInfo = useCallback(() => {
    setLoading(true);
    fetchDashboard()
      .then((res) => {
        if (res.status === 'success') {
          setInfo(res.body);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  }, []);

  return {
    info,
    getInfo,
    loading,
  };
}
