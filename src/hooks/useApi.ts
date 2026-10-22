import { useState, useCallback } from 'react';
import { ApiError } from '../types/errors';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export const useApi = <T>() => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const apiError = error instanceof ApiError 
        ? error 
        : new ApiError('UNKNOWN' as any, 'Error desconocido');
      setState({ data: null, loading: false, error: apiError });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};