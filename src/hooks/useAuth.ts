
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  getCurrentUser,
  LoginRequest,
  RegisterRequest,
} from '../api/auth.api';

import { setUser as setReduxUser, setToken } from '../store/store';
import { ApiError, ErrorType } from '../types/errors';
import { User } from '../types/user';

import {
  clearTokens,
  getAccessToken,
  saveAccessToken,
  saveRefreshToken,
} from '../utils/storage';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const mountedRef = useRef(false);
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Verificar sesión existente
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);

      const token = await getAccessToken();

      if (!mountedRef.current) return;

      if (token) {
        const profile = await getCurrentUser();

        if (!mountedRef.current) return;

        setUser(profile);
        dispatch(setReduxUser(profile));
        dispatch(setToken(token));
      } else {
        setUser(null);
        dispatch(setReduxUser(null));
        dispatch(setToken(null));
      }
    } catch (err) {
      if (!mountedRef.current) return;

      console.error('Error verificando autenticación:', err);

      await clearTokens();

      if (!mountedRef.current) return;

      setUser(null);
      dispatch(setReduxUser(null));
      dispatch(setToken(null));
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    mountedRef.current = true;

    checkAuth();

    return () => {
      mountedRef.current = false;
    };
  }, [checkAuth]);

  /**
   * Esta modificación evita actualizar estados locales después del desmontaje. No cancela realmente las peticiones HTTP; simplemente ignora sus resultados. Además, el mountedRef debe utilizarse con cuidado si el hook se consume desde varios componentes simultáneamente, porque cada instancia tendrá su propia referencia.
   */

  // Iniciar sesión
  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiLogin(credentials);

        await saveAccessToken(response.accessToken);

        if (response.refreshToken) {
          await saveRefreshToken(response.refreshToken);
        }

        setUser(response.user);

        dispatch(setReduxUser(response.user));
        dispatch(setToken(response.accessToken));

        return true;
      } catch (err) {
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(ErrorType.UNKNOWN, 'Error en login');

        setError(apiError);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  // Registrar usuario e iniciar sesión
  const register = useCallback(
    async (data: RegisterRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await apiRegister(data);

        const response = await apiLogin({
          email: data.email,
          password: data.password,
        });

        await saveAccessToken(response.accessToken);

        if (response.refreshToken) {
          await saveRefreshToken(response.refreshToken);
        }

        setUser(response.user);

        dispatch(setReduxUser(response.user));
        dispatch(setToken(response.accessToken));

        return true;
      } catch (err) {
        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(
                ErrorType.UNKNOWN,
                'Error al registrar e iniciar sesión'
              );

        setError(apiError);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  // Cerrar sesión
  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error('Error en logout:', err);
    } finally {
      await clearTokens();

      setUser(null);
      setError(null);

      dispatch(setReduxUser(null));
      dispatch(setToken(null));

      router.replace('/');
    }
  }, [dispatch, router]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
};
