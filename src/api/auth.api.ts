import { apiClient } from './client';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/students', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<{ data: User }>('/auth/me');
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.log('Error en logout:', error);
    }
  },
};