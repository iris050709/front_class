
/**
 * Layout raíz de la aplicación.
 * Gestiona los proveedores globales y la autenticación.
 */

import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, type ReactNode } from 'react';

import { AuthProvider, useAuthContext } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { NotificationProvider } from '../context/NotificationContext';
import { ThemeProvider } from '../context/ThemeContext';

import NotificationList from '../components/NotificationList';

function AppInitializer({
  children,
}: {
  children: ReactNode;
}) {
  const { user, initializing } = useAuthContext();

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (initializing) return;

    const firstSegment = segments[0];

    const isPublicRoute =
      firstSegment === 'login' ||
      firstSegment === 'register';

    // Usuario sin sesión: permitir solamente rutas públicas.
    if (!user && !isPublicRoute) {
      router.replace('/login');
      return;
    }

    // Usuario autenticado: evitar login, registro e inicio vacío.
    if (user && (isPublicRoute || firstSegment === undefined)) {
      router.replace('/(tabs)/home');
    }
  }, [user, initializing, segments, router]);

  if (initializing) {
    return null;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <NotificationProvider>

            <AppInitializer>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="student/[id]" />
                <Stack.Screen name="student/create" />
                <Stack.Screen name="user/create" />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
              </Stack>
            </AppInitializer>

            {/* Sistema global de notificaciones */}
            <NotificationList />

          </NotificationProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
