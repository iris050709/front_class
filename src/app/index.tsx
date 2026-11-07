/**
 * Pantalla inicial de la aplicación.
 * Redirige al usuario según su sesión.
 */

import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

import { RootState } from "../store/store";

export default function IndexScreen() {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const token = useSelector(
    (state: RootState) => state.auth.token
  );

  // Si existe una sesión activa, ir al inicio.
  if (user && token) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Si no existe sesión, mostrar el Login.
  return <Redirect href="/login" />;
}