
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as authApi from "../api/auth.api";
import { AppDispatch, setToken, setUser } from "../store/store";
import {
    saveAccessToken,
    saveRefreshToken,
} from "../utils/storage";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError("");

    try {
      const response = await authApi.login({
        email,
        password,
      });

      if (!response.accessToken || !response.refreshToken) {
        throw new Error("La API no devolvió los tokens necesarios");
      }

      await saveAccessToken(response.accessToken);
      await saveRefreshToken(response.refreshToken);

      dispatch(setToken(response.accessToken));
      dispatch(setUser(response.user));

      return true;

    } catch (err: any) {
      console.error(
        "Error de login:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "No se pudo iniciar sesión"
      );

      return false;

    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
};
/**
 * Se elimina la petición adicional a /api/students, porque el backend ya devuelve nombre, apellido y matrícula cuando inicia sesión un estudiante.
 * Con esto, el usuario que devuelve el backend se almacena directamente en Redux.
 */