import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";

import { getCurrentUser } from "../api/auth.api";
import { NotificationProvider } from "../context/NotificationContext";
import { AppDispatch, setToken, setUser, store } from "../store/store";
import {
  clearTokens,
  getAccessToken,
} from "../utils/storage";

import NotificationList from "../components/NotificationList";
import { CartProvider } from "../context/CartContext";
import { ThemeProvider } from "../context/ThemeContext";

import Loading from "../components/Loading";

function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const [checkingSession, setCheckingSession] = useState(true);

  
  useEffect(() => {
    let active = true;

    const initializeSession = async () => {
      try {
        const token = await getAccessToken();

        if (!active) return;

        if (!token) {
          dispatch(setToken(null));
          dispatch(setUser(null));
          return;
        }

        const user = await getCurrentUser();

        if (!active) return;

        dispatch(setToken(token));
        dispatch(setUser(user));

      } catch (error) {
        console.log('Error al recuperar la sesión:', error);

        if (!active) return;

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
        name="home"
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
      <ThemeProvider>
        <CartProvider>
          <NotificationProvider>
            <>
              <AppInitializer />
              <NotificationList />
            </>
          </NotificationProvider>
        </CartProvider>
      </ThemeProvider>
    </Provider>
  );
}