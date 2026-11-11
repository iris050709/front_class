
/**
 * Hook personalizado para realizar peticiones HTTP.
 * Maneja automáticamente estados de loading, error y data.
 * Evita recrear execute en cada renderizado.
 */

import { useCallback, useRef, useState } from 'react';
import {
  type ApiError,
  handleApiError,
} from '../utils/errorHandler';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: unknown[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Mantener siempre la última función API.
  const apiFunctionRef = useRef(apiFunction);
  apiFunctionRef.current = apiFunction;

  // Identificar la petición más reciente.
  const requestIdRef = useRef(0);

  // Función estable entre renderizados.
  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      const currentRequestId = ++requestIdRef.current;

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const result = await apiFunctionRef.current(...args);

        if (currentRequestId === requestIdRef.current) {
          setState({
            data: result,
            loading: false,
            error: null,
          });
        }

        return result;
      } catch (error: unknown) {
        const apiError = handleApiError(error);

        if (currentRequestId === requestIdRef.current) {
          setState({
            data: null,
            loading: false,
            error: apiError,
          });
        }

        return null;
      }
    },
    []
  );

  // Reiniciar estados e invalidar peticiones anteriores.
  const reset = useCallback(() => {
    requestIdRef.current++;

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
