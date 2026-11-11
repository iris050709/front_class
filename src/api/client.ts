
/**
 * Cliente HTTP configurado con Axios.
 * Incluye interceptores para manejo automático de tokens,
 * renovación de sesión y errores de autenticación.
 */

import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from '../utils/storage';

const API_BASE_URL = 'http://localhost:3000';

// Para evitar que una misma petición se reintente infinitamente.
interface CustomAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Permite avisar a AuthContext cuando la sesión termina.
type AuthFailureHandler = (() => void) | null;

let authFailureHandler: AuthFailureHandler = null;

export function setAuthFailureHandler(
  handler: AuthFailureHandler
): void {
  authFailureHandler = handler;
}

// Instancia de Axios.
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Una sola renovación de token para varias peticiones simultáneas.
let refreshPromise: Promise<string> | null = null;

/**
 * Renovar los tokens utilizando el refreshToken.
 */
async function renewAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    throw new Error('Credenciales inválidas.');
  }

  const response = await axios.post(
    `${API_BASE_URL}/api/auth/refresh`,
    { refreshToken },
    {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const {
    accessToken,
    refreshToken: newRefreshToken,
  } = response.data;

  if (!accessToken || !newRefreshToken) {
    throw new Error(
      'La API no devolvió los nuevos tokens necesarios.'
    );
  }

  await saveAccessToken(accessToken);
  await saveRefreshToken(newRefreshToken);

  return accessToken;
}

// Interceptor de peticiones: agrega el accessToken.
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas: maneja errores y renueva tokens.
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config as CustomAxiosRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // No intentar renovar ante errores diferentes de 401.
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Evitar repetir una petición más de una vez.
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Si otra petición ya está renovando el token,
      // esperar a que termine.
      if (!refreshPromise) {
        refreshPromise = renewAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      // Reintentar la petición original con el nuevo token.
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);

    } catch (refreshError) {
      // Si no se puede renovar la sesión, eliminar los tokens.
      try {
        await clearTokens();
      } catch (storageError) {
        console.error(
          'Error eliminando tokens:',
          storageError
        );
      }

      // Avisar a AuthContext que la sesión terminó.
      authFailureHandler?.();

      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
