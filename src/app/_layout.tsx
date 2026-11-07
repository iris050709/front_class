import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { getCurrentUser } from '../api/auth.api';

import { CartProvider } from '../context/CartContext';
import { NotificationProvider } from '../context/NotificationContext';
import { ThemeProvider } from '../context/ThemeContext';

import Loading from '../components/Loading';
import NotificationList from '../components/NotificationList';

import {
  AppDispatch,
  RootState,
  setToken,
  setUser,
  store,
} from '../store/store';

import {
  clearTokens,
  getAccessToken,
} from '../utils/storage';

function AppInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const segments = useSegments();

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const [checkingSession, setCheckingSession] = useState(true);

  // Recuperar la sesión al iniciar la aplicación.
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

        const profile = await getCurrentUser();

        if (!active) return;

        dispatch(setToken(token));
        dispatch(setUser(profile));

      } catch (error) {
        console.error('Error recuperando sesión:', error);

        if (!active) return;

        try {
          await clearTokens();
        } catch (storageError) {
          console.error('Error eliminando tokens:', storageError);
        }

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

  // Protección y redirección de rutas.
  useEffect(() => {
    if (checkingSession) return;

    const firstSegment = segments[0];

    // Rutas públicas.
    const isPublicRoute =
      firstSegment === 'login' ||
      firstSegment === 'register';

    // Sin sesión: solamente permitir Login y Registro.
    if (!user && !isPublicRoute) {
      router.replace('/');
      return;
    }

    // Con sesión: evitar volver a Login o Registro.
    if (user && isPublicRoute) {
      router.replace('/(tabs)/home');
    }

  }, [checkingSession, user, segments, router]);

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
        options={{ title: 'Detalle de estudiante' }}
      />

      <Stack.Screen
        name="student/create"
        options={{ title: 'Agregar estudiante' }}
      />

      <Stack.Screen
        name="user/create"
        options={{ title: 'Agregar usuario' }}
      />

      <Stack.Screen
        name="login"
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="register"
        options={{ headerShown: false }}
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