
/**
 * Utilidad para manejar errores de red y API.
 * Convierte errores técnicos en mensajes amigables.
 */

import axios from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
}

/**
 * Convierte errores de Axios y errores generales
 * en mensajes comprensibles para el usuario.
 */
export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;

      const serverMessage =
        error.response.data?.error ||
        error.response.data?.message;

      switch (status) {
        case 400:
          return {
            message:
              serverMessage ||
              'Datos inválidos. Por favor, revisa la información.',
            statusCode: status,
          };

        case 401:
          return {
            message:
              serverMessage ||
              'Sesión expirada. Por favor, inicia sesión nuevamente.',
            statusCode: status,
          };

        case 403:
          return {
            message:
              serverMessage ||
              'No tienes permisos para realizar esta acción.',
            statusCode: status,
          };

        case 404:
          return {
            message:
              serverMessage ||
              'El recurso solicitado no existe.',
            statusCode: status,
          };

        case 409:
          return {
            message:
              serverMessage ||
              'El recurso ya existe.',
            statusCode: status,
          };

        case 500:
          return {
            message:
              'Error del servidor. Intenta más tarde.',
            statusCode: status,
          };

        default:
          return {
            message:
              serverMessage ||
              `Error del servidor (${status}).`,
            statusCode: status,
          };
      }
    }

    if (error.request) {
      return {
        message:
          'No se pudo conectar con el servidor. Verifica tu conexión.',
      };
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message:
      'Ocurrió un error inesperado. Intenta nuevamente.',
  };
}

/**
 * Verifica si un error corresponde a autenticación (401).
 */
export function isAuthError(error: unknown): boolean {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 401
  );
}
