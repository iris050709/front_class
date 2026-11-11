
/**
 * Pantalla inicial de la aplicación.
 * Redirige al usuario según el estado de su sesión.
 */

import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function IndexScreen() {
  const { user, initializing } = useAuthContext();
  const { colors } = useTheme();

  // Esperar a que AuthContext termine de verificar la sesión.
  if (initializing) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Si existe una sesión, ir al inicio.
  if (user) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Si no existe una sesión, ir al login.
  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
