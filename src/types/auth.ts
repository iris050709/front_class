export interface User {
  id: number;
  email: string;
  nombre?: string;
  apellido?: string;
  matricula?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface TokenPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}