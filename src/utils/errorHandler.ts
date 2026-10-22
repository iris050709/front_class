import axios, { AxiosError } from 'axios';
import { ApiError, ErrorType } from '../types/errors';

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    // Error de red (sin conexión)
    if (!axiosError.response) {
      return new ApiError(
        ErrorType.NETWORK_ERROR,
        'Sin conexión a internet. Verifica tu conexión e intenta de nuevo.',
        0
      );
    }

    // Timeout
    if (axiosError.code === 'ECONNABORTED') {
      return new ApiError(
        ErrorType.TIMEOUT,
        'La solicitud tardó demasiado. Intenta de nuevo.',
        408
      );
    }

    const status = axiosError.response.status;
    const data = axiosError.response.data;

    switch (status) {
      case 400:
        return new ApiError(
          ErrorType.VALIDATION_ERROR,
          data?.message || 'Los datos enviados no son válidos.',
          status,
          data
        );
      
      case 401:
        return new ApiError(
          ErrorType.UNAUTHORIZED,
          'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
          status,
          data
        );
      
      case 403:
        return new ApiError(
          ErrorType.FORBIDDEN,
          'No tienes permisos para realizar esta acción.',
          status,
          data
        );
      
      case 404:
        return new ApiError(
          ErrorType.NOT_FOUND,
          data?.message || 'El recurso solicitado no existe.',
          status,
          data
        );
      
      case 409:
        return new ApiError(
          ErrorType.VALIDATION_ERROR,
          data?.message || 'Ya existe un registro con estos datos.',
          status,
          data
        );
      
      case 500:
        return new ApiError(
          ErrorType.SERVER_ERROR,
          'Error en el servidor. Intenta más tarde.',
          status,
          data
        );
      
      default:
        return new ApiError(
          ErrorType.SERVER_ERROR,
          data?.message || 'Ha ocurrido un error inesperado.',
          status,
          data
        );
    }
  }

  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError(
    ErrorType.UNKNOWN,
    'Ha ocurrido un error inesperado.'
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Ha ocurrido un error inesperado.';
};