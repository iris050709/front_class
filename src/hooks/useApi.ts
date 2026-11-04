/**
 * Hook personalizado para realizar peticiones HTTP.
 * Maneja automáticamente estados de loading, error y data.
 * Evita recrear execute en cada renderizado.
 */

import { useCallback, useRef, useState } from 'react';
import { ApiError, handleApiError } from '../utils/errorHandler';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Mantener siempre la última función API.
  const apiFunctionRef = useRef(apiFunction);
  apiFunctionRef.current = apiFunction;

  // Esta función permanece estable entre renderizados.
  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const result = await apiFunctionRef.current(...args);

        setState({
          data: result,
          loading: false,
          error: null,
        });

        return result;
      } catch (error) {
        const apiError = handleApiError(error);

        setState({
          data: null,
          loading: false,
          error: apiError,
        });

        return null;
      }
    },
    []
  );

  // Reiniciar estados.
  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}