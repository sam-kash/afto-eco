import { useState } from 'react';
import { searchService } from '../services/api';

export function useSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query, filters = {}) => {
    setLoading(true);
    try {
      const res = await searchService.search(query, filters);
      setResults(res.data.data.hits);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}