import { useState, useCallback } from 'react'
import { fetch } from '@/services/article';

export default function useArticleModel() {
  const [data, setData] = useState<API.ArticleList>({total: 0, data: [], page: 1});
  const [loading, setLoading] = useState(true)

  const getList = useCallback((params) => {
    setLoading(true)
    fetch(params).then(res => {
      if(res.status === 'success'){
        setData(res.body)
      }
    }).finally(() => {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    })
  }, [])


  return {
    data,
    getList,
    loading,
  }
}
