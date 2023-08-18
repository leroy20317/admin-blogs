import { useState, useCallback } from 'react';
import { fetch } from '@/services/clash';

export default function useClashModel() {
  const [rules, setRules] = useState<API.ResponseList<API.Clash['rules']>>({
    total: 0,
    data: [],
    page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState<API.Clash['types']>([]);
  const [modes, setModes] = useState<API.Clash['modes']>([]);

  const getRuleList = useCallback((params?) => {
    setLoading(true);
    fetch({ ...params, mode: 'rules' })
      .then((res) => {
        if (res.status === 'success') {
          setRules(res.body);
        }
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  }, []);

  const getTypeList = useCallback(() => {
    fetch({ mode: 'types' }).then((res) => {
      if (res.status === 'success') {
        setTypes(res.body);
      }
    });
  }, []);

  const getModeList = useCallback(() => {
    fetch({ mode: 'modes' }).then((res) => {
      if (res.status === 'success') {
        setModes(res.body);
      }
    });
  }, []);

  return {
    rules,
    getRuleList,
    loading,
    types,
    getTypeList,
    modes,
    getModeList,
  };
}
