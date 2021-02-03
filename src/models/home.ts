import { useState, useCallback } from 'react';
import { fetchHome } from '@/services/common';

export default function useHomeModel() {
  const [info, setInfo] = useState<API.Home>();
  const [loading, setLoading] = useState(true);

  const getInfo = useCallback(() => {
    setLoading(true);
    fetchHome()
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
