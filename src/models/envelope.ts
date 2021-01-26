import { useState, useCallback } from 'react';
import { fetch } from '@/services/envelope';

export default function useEnvelopeModel() {
  const [data, setData] = useState<API.EnvelopeList>({ total: 0, data: [], page: 1 });
  const [loading, setLoading] = useState(true);

  const getList = useCallback((params) => {
    setLoading(true);
    fetch(params)
      .then((res) => {
        if (res.status === 'success') {
          setData(res.body);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  }, []);

  return {
    data,
    getList,
    loading,
  };
}
