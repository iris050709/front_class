/**
 * Utilidad para manejar errores de red y API
 * Convierte errores técnicos en mensajes amigables para el usuario
 */

import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
}

/**
 * Convierte un error de Axios en un mensaje amigable
 */
export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    // Error de respuesta del servidor
    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.error;

      // Errores específicos por código de estado
      switch (status) {
        case 400:
          return {
            message: serverMessage || 'Datos inválidos. Por favor, revisa la información.',
            statusCode: status,
          };
        case 401:
          return {
            message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
            statusCode: status,
          };
        case 403:
          return {
            message: 'No tienes permisos para realizar esta acción.',
            statusCode: status,
          };
        case 404:
          return {
            message: 'El recurso solicitado no existe.',
            statusCode: status,
          };
        case 409:
          return {
            message: serverMessage || 'El recurso ya existe.',
            statusCode: status,
          };
        case 500:
          return {
            message: 'Error del servidor. Intenta más tarde.',
            statusCode: status,
          };
        default:
          return {
            message: serverMessage || `Error del servidor (${status})`,
            statusCode: status,
          };
      }
    }

    // Error de red (sin conexión)
    if (error.request) {
      return {
        message: 'Sin conexión a internet. Verifica tu red.',
      };
    }
  }

  // Error genérico
  return {
    message: 'Ocurrió un error inesperado. Intenta nuevamente.',
  };
}

/**
 * Verifica si un error es de autenticación (401)
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
}