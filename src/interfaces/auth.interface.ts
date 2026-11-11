
import { User } from '../types/user';

/**
 * Datos enviados al iniciar sesión.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Respuesta del backend al iniciar sesión.
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * Datos enviados al registrar una cuenta.
 */
export interface RegisterRequest {
  email: string;
  password: string;
}

/**
 * Respuesta del registro.
 */
export interface RegisterResponse {
  user: User;
}

/**
 * Respuesta al renovar los tokens.
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Propiedades del formulario de login.
 */
export interface LoginFormProps {
  onLogin: (
    email: string,
    password: string
  ) => void | Promise<void>;
  loading: boolean;
  error: string;
}
