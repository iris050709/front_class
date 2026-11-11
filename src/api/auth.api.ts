
/**
 * Servicio de autenticación.
 * Contiene las peticiones HTTP relacionadas con usuarios.
 */

import type { User, UserMeResponse } from '../types/user';
import { getRefreshToken } from '../utils/storage';
import apiClient from './client';

// Datos para iniciar sesión.
export interface LoginRequest {
  email: string;
  password: string;
}

// Respuesta del login.
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Datos para registrar usuarios.
export interface RegisterRequest {
  email: string;
  password: string;
}

// Respuesta de renovación de tokens.
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Iniciar sesión.
 */
export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    '/api/auth/login',
    data
  );

  return response.data;
}

/**
 * Registrar un usuario.
 */
export async function register(
  data: RegisterRequest
): Promise<{ user: User }> {
  const response = await apiClient.post<{ user: User }>(
    '/api/auth/register',
    data
  );

  return response.data;
}

/**
 * Crear un administrador.
 */
export async function createAdmin(
  data: RegisterRequest
): Promise<{ user: User }> {
  const response = await apiClient.post<{ user: User }>(
    '/api/auth/users',
    data
  );

  return response.data;
}

/**
 * Obtener los datos del usuario autenticado.
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<UserMeResponse>(
    '/api/auth/me'
  );

  return response.data.data;
}

/**
 * Renovar los tokens.
 */
export async function refreshToken(
  refreshTokenValue: string
): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>(
    '/api/auth/refresh',
    {
      refreshToken: refreshTokenValue,
    }
  );

  return response.data;
}

/**
 * Cerrar sesión en el backend.
 */
export async function logout(): Promise<void> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return;
  }

  await apiClient.post('/api/auth/logout', {
    refreshToken,
  });
}
