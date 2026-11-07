
import { User, UserMeResponse } from "../types/user";
import { getRefreshToken } from "../utils/storage";
import apiClient from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/api/auth/login",
    data
  );

  return response.data;
}

export async function register(
  data: RegisterRequest
): Promise<{ user: User }> {
  const response = await apiClient.post<{ user: User }>(
    "/api/auth/register",
    data
  );

  return response.data;
}

export async function createAdmin(
  data: RegisterRequest
): Promise<{ user: User }> {
  const response = await apiClient.post<{ user: User }>(
    "/api/auth/users",
    data
  );

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<UserMeResponse>(
    "/api/auth/me"
  );

  return response.data.data;
}

export async function refreshToken(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>(
    "/api/auth/refresh",
    { refreshToken }
  );

  return response.data;
}


export async function logout(): Promise<void> {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    await apiClient.post('/api/auth/logout', {
      refreshToken,
    });
  }
}

