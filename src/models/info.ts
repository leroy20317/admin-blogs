import { useState, useCallback } from 'react'
import { fetchInfo } from '@/services/common';

export default function useInfoModel() {
  const [info, setInfo] = useState<API.Data>();
  const [loading, setLoading] = useState(true)

  const getInfo = useCallback(() => {
    setLoading(true)
    fetchInfo().then(res => {
      if(res.status === 'success'){
        setInfo(res.body)
      }
    }).finally(() => {
      setTimeout(() => {
        setLoading(false)
      }, 100)
    })
  }, [])


  return {
    info,
    getInfo,
    loading
  }
}
