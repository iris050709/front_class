import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { authApi } from '../api/auth.api';
import { setUser as setReduxUser, setToken } from '../store/store';
import { LoginCredentials, RegisterData, User } from '../types/auth';
import { ApiError, ErrorType } from '../types/errors';
import { storage } from '../utils/storage';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useDispatch();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Verificar si existe una sesión y recuperar el perfil
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);

      const token = await storage.getToken();

      if (token) {
        const profile = await authApi.getProfile();

        // Actualizar el estado local
        setUser(profile);

        // Actualizar Redux
        dispatch(setReduxUser(profile));
        dispatch(setToken(token));
      } else {
        setUser(null);

        dispatch(setReduxUser(null));
        dispatch(setToken(null));
      }
    } catch (err) {
      console.error('Error verificando autenticación:', err);

      await storage.clearAll();

      setUser(null);
      dispatch(setReduxUser(null));
      dispatch(setToken(null));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Iniciar sesión
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await authApi.login(credentials);

        // Guardar tokens
        await storage.saveToken(response.accessToken);

        if (response.refreshToken) {
          await storage.saveRefreshToken(response.refreshToken);
        }

        // Actualizar estado local
        setUser(response.user);

        // Actualizar Redux
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

  // Registrar usuario
  
  const register = useCallback(
    async (data: RegisterData): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        // 1. Registrar al estudiante
        await authApi.register(data);

        // 2. Iniciar sesión con las credenciales registradas
        const response = await authApi.login({
          email: data.email,
          password: data.password,
        });

        // 3. Guardar los tokens de autenticación
        await storage.saveToken(response.accessToken);

        if (response.refreshToken) {
          await storage.saveRefreshToken(response.refreshToken);
        }

        // 4. Actualizar el estado local y Redux
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
      await authApi.logout();
    } catch (err) {
      console.error('Error en logout:', err);
    } finally {
      await storage.clearAll();

      setUser(null);

      dispatch(setReduxUser(null));
      dispatch(setToken(null));
    }
  }, [dispatch]);

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