import { useEffect, useState, useCallback } from 'react';
import apiClient from '../api/apiClient';

function useFetchRecipes({ search = '', page = 1, limit = 10 }) {
  const [data, setData] = useState({ recipes: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forceReload, setForceReload] = useState(0);

  const reload = useCallback(() => setForceReload((prev) => prev + 1), []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');
    apiClient
      .get('/recipes', {
        params: {
          search,
          page,
          limit
        }
      })
      .then((res) => {
        if (isMounted) {
          setData(res.data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || 'Unable to fetch recipes');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [search, page, limit, forceReload]);

  return { data, loading, error, reload };
}

export default useFetchRecipes;
