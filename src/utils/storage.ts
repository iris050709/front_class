
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'user_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const webStorageAvailable = () =>
  Platform.OS === 'web' && typeof localStorage !== 'undefined';

export const storage = {
  async saveToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (!webStorageAvailable()) {
          throw new Error('El almacenamiento web no está disponible');
        }
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error guardando token:', error);
      throw new Error('No se pudo guardar el token');
    }
  },

  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return webStorageAvailable()
          ? localStorage.getItem(TOKEN_KEY)
          : null;
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (webStorageAvailable()) {
          localStorage.removeItem(TOKEN_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error eliminando token:', error);
    }
  },

  async saveRefreshToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (!webStorageAvailable()) {
          throw new Error('El almacenamiento web no está disponible');
        }
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
      } else {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error guardando refresh token:', error);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return webStorageAvailable()
          ? localStorage.getItem(REFRESH_TOKEN_KEY)
          : null;
      }
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo refresh token:', error);
      return null;
    }
  },

  async removeRefreshToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (webStorageAvailable()) {
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error eliminando refresh token:', error);
    }
  },

  async clearAll(): Promise<void> {
    await Promise.all([
      this.removeToken(),
      this.removeRefreshToken(),
    ]);
  },
};
