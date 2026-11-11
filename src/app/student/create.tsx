
/**
 * Pantalla para registrar un nuevo estudiante.
 * Compatible con Web, Android e iOS.
 */

import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { createStudent } from '../../api/students.api';
import StudentForm from '../../components/StudentForm';
import { useAuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import type { Student } from '../../types/student';

export default function CreateStudentScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, initializing } = useAuthContext();

  const { showSuccess, showError } = useNotification();

  const [loading, setLoading] = useState(false);

  // Restringir el acceso a estudiantes.
  useEffect(() => {
    if (!initializing && user?.kind !== 'user') {
      router.replace('/(tabs)/home');
    }
  }, [user, initializing, router]);

  // Evitar mostrar el formulario mientras se verifica la sesión
  // o cuando el usuario no tiene permisos de administrador.
  if (initializing || user?.kind !== 'user') {
    return null;
  }

  const handleCreateStudent = async (
    data: Omit<Student, 'id' | 'created_at' | 'updated_at'> & {
      password?: string;
    }
  ) => {
    if (!data.password) {
      const message = 'La contraseña es obligatoria.';
      showError(message);
      throw new Error(message);
    }

    setLoading(true);

    try {
      await createStudent({
        ...data,
        password: data.password,
        email: data.email.trim().toLowerCase(),
      });

      showSuccess('¡Estudiante registrado correctamente!');

      setTimeout(() => {
        router.replace('/(tabs)/students');
      }, 1000);
    } catch (err: unknown) {
      console.error('Error al registrar estudiante:', err);

      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo registrar el estudiante. Intenta nuevamente.';

      showError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen
        options={{
          title: 'Agregar estudiante',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            color: colors.text,
            fontSize: 17,
            fontWeight: '700',
          },
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          headerBackTitle: 'Estudiantes',
          headerBackVisible: true,
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Encabezado */}
          <View
            style={[
              styles.header,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🎓</Text>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              Nuevo estudiante
            </Text>

            <Text style={[styles.subtitle, { color: colors.secondary }]}>
              Completa los siguientes datos para registrar un estudiante.
            </Text>
          </View>

          {/* Indicador de carga */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color={colors.primary}
              />

              <Text
                style={[
                  styles.loadingText,
                  { color: colors.secondary },
                ]}
              >
                Registrando estudiante...
              </Text>
            </View>
          )}

          {/* Formulario */}
          <View
            style={[
              styles.formContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <StudentForm
              onSubmit={handleCreateStudent}
              onCancel={() => router.back()}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  content: {
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 18,
    borderRadius: 18,
    borderWidth: 1,
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 38,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 14,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
  },
});
