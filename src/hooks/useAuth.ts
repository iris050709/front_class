
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  createAdmin as apiCreateAdmin,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  getCurrentUser,
  LoginRequest,
  RegisterRequest,
} from '../api/auth.api';

import {
  AppDispatch,
  RootState,
  setToken,
  setUser,
} from '../store/store';

import { ApiError, ErrorType } from '../types/errors';

import {
  clearTokens,
  getAccessToken,
  saveAccessToken,
  saveRefreshToken,
} from '../utils/storage';

interface UseAuthReturn {
  user: RootState['auth']['user'];
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  createAdmin: (data: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Redux es la única fuente de información del usuario.
  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Verificar sesión únicamente cuando se solicite manualmente.
  // La recuperación automática corresponde a AppInitializer.
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);

      const token = await getAccessToken();

      if (!token) {
        dispatch(setUser(null));
        dispatch(setToken(null));
        return;
      }

      const profile = await getCurrentUser();

      dispatch(setUser(profile));
      dispatch(setToken(token));

    } catch (err) {
      console.error('Error verificando autenticación:', err);

      try {
        await clearTokens();
      } finally {
        dispatch(setUser(null));
        dispatch(setToken(null));
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Iniciar sesión.
  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiLogin(credentials);

        if (!response.accessToken || !response.refreshToken) {
          throw new Error('La API no devolvió los tokens necesarios');
        }

        await saveAccessToken(response.accessToken);
        await saveRefreshToken(response.refreshToken);

        dispatch(setUser(response.user));
        dispatch(setToken(response.accessToken));

        return true;

      } catch (err) {
        console.error('Error iniciando sesión:', err);

        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(
                ErrorType.UNKNOWN,
                err instanceof Error
                  ? err.message
                  : 'Error en el inicio de sesión'
              );

        setError(apiError);
        return false;

      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  // Registrar usuario e iniciar sesión.
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

        if (!response.accessToken || !response.refreshToken) {
          throw new Error('La API no devolvió los tokens necesarios');
        }

        await saveAccessToken(response.accessToken);
        await saveRefreshToken(response.refreshToken);

        dispatch(setUser(response.user));
        dispatch(setToken(response.accessToken));

        return true;

      } catch (err) {
        console.error('Error al registrar:', err);

        const apiError =
          err instanceof ApiError
            ? err
            : new ApiError(
                ErrorType.UNKNOWN,
                err instanceof Error
                  ? err.message
                  : 'Error al registrar e iniciar sesión'
              );

        setError(apiError);
        return false;

      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const createAdmin = useCallback(
    async (data: RegisterRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await apiCreateAdmin(data);

        return true;
      } catch (err) {
        console.error('Error creando administrador:', err);

        const apiError = err instanceof ApiError
          ? err
          : new ApiError(
              ErrorType.UNKNOWN,
              err instanceof Error
                ? err.message
                : 'Error al crear administrador'
            );

        setError(apiError);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Cerrar sesión.
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Intentar cerrar la sesión también en el backend.
      await apiLogout();
    } catch (err) {
      console.error('Error cerrando sesión en el servidor:', err);
    } finally {
      // Limpiar primero el estado de autenticación.
      dispatch(setUser(null));
      dispatch(setToken(null));
      setError(null);

      try {
        await clearTokens();
      } catch (err) {
        console.error('Error eliminando tokens:', err);
      }

      // Volver al login.
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
    createAdmin,
    logout,
    checkAuth,
    clearError,
  };
};
