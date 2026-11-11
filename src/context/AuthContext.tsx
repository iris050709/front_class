
/**
 * Contexto global de autenticación.
 * Centraliza el estado y las funciones de autenticación.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type {
  LoginRequest,
  RegisterRequest,
} from '../api/auth.api';
import * as authApi from '../api/auth.api';

import { setAuthFailureHandler } from '../api/client';

import type { User } from '../types/user';

import {
  handleApiError,
  type ApiError,
} from '../utils/errorHandler';

import {
  clearTokens,
  getAccessToken,
  saveAccessToken,
  saveRefreshToken,
} from '../utils/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initializing: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;

  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  createAdmin: (data: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Recuperar la sesión al abrir la aplicación.
   */
  const checkAuth = useCallback(async () => {
    setInitializing(true);

    try {
      const token = await getAccessToken();

      if (!token) {
        setUser(null);
        return;
      }

      const currentUser = await authApi.getCurrentUser();

      setUser(currentUser);
      setError(null);

    } catch (err) {
      console.error('Error recuperando sesión:', err);

      setUser(null);
      setError(handleApiError(err));

      try {
        await clearTokens();
      } catch (storageError) {
        console.error(
          'Error limpiando tokens:',
          storageError
        );
      }

    } finally {
      setInitializing(false);
    }
  }, []);

  /**
   * Iniciar sesión.
   */
  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const response = await authApi.login(credentials);

        if (!response.accessToken || !response.refreshToken) {
          throw new Error(
            'La API no devolvió los tokens necesarios.'
          );
        }

        try {
          await saveAccessToken(response.accessToken);
          await saveRefreshToken(response.refreshToken);
        } catch (storageError) {
          await clearTokens();
          throw storageError;
        }

        setUser(response.user);

        return true;

      } catch (err) {
        setError(handleApiError(err));
        return false;

      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Registrar usuario e iniciar sesión automáticamente.
   */
  const register = useCallback(
    async (data: RegisterRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await authApi.register(data);

        const response = await authApi.login({
          email: data.email,
          password: data.password,
        });

        if (!response.accessToken || !response.refreshToken) {
          throw new Error(
            'La API no devolvió los tokens necesarios.'
          );
        }

        try {
          await saveAccessToken(response.accessToken);
          await saveRefreshToken(response.refreshToken);
        } catch (storageError) {
          await clearTokens();
          throw storageError;
        }

        setUser(response.user);

        return true;

      } catch (err) {
        setError(handleApiError(err));
        return false;

      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Crear un administrador.
   * No modifica la sesión del administrador actual.
   */
  const createAdmin = useCallback(
    async (data: RegisterRequest): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await authApi.createAdmin(data);

        return true;

      } catch (err) {
        setError(handleApiError(err));
        return false;

      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Cerrar sesión.
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();

    } catch (err) {
      console.error(
        'Error cerrando sesión en el servidor:',
        err
      );

    } finally {
      try {
        await clearTokens();
      } catch (storageError) {
        console.error(
          'Error eliminando tokens:',
          storageError
        );
      }

      setUser(null);
      setError(null);
    }
  }, []);

  /**
   * Escuchar fallos definitivos de renovación de tokens
   * comunicados por el cliente Axios.
   */
  useEffect(() => {
    setAuthFailureHandler(() => {
      setUser(null);
      setError({
        message:
          'Tu sesión expiró. Inicia sesión nuevamente.',
        statusCode: 401,
      });
    });

    return () => {
      setAuthFailureHandler(null);
    };
  }, []);

  /**
   * Recuperar la sesión al montar el Provider.
   */
  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      initializing,
      error,
      isAuthenticated: user !== null,
      login,
      register,
      createAdmin,
      logout,
      checkAuth,
      clearError,
    }),
    [
      user,
      loading,
      initializing,
      error,
      login,
      register,
      createAdmin,
      logout,
      checkAuth,
      clearError,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para consumir el contexto de autenticación.
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuthContext debe utilizarse dentro de AuthProvider.'
    );
  }

  return context;
}
