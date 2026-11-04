import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";

import { getCurrentUser } from "../api/auth.api";
import { AppDispatch, setToken, setUser, store } from "../store/store";
import {
    clearTokens,
    getAccessToken,
} from "../utils/storage";

import Loading from "../components/Loading";

function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    const initializeSession = async () => {
      try {
        const token = await getAccessToken();

        if (!token) {
          dispatch(setToken(null));
          dispatch(setUser(null));
          return;
        }

        // Recuperar los datos del usuario desde la API
        const user = await getCurrentUser();

        if (!active) return;

        // Restaurar la sesión en Redux
        dispatch(setToken(token));
        dispatch(setUser(user));

      } catch (error) {
        console.log("Error al recuperar la sesión:", error);

        await clearTokens();

        if (!active) return;

        dispatch(setToken(null));
        dispatch(setUser(null));

      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    };

    initializeSession();

    return () => {
      active = false;
    };
  }, [dispatch]);

  // No mostrar las pantallas hasta terminar la comprobación
  if (checkingSession) {
    return <Loading message="Verificando sesión..." />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="student/[id]"
        options={{ title: "Detalle de Estudiante" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppInitializer />
    </Provider>
  );
}