/**
 * Pantalla para registrar un nuevo estudiante.
 * Compatible con Web, Android e iOS.
 */

import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { createStudent } from '../../api/students.api';
import StudentForm from '../../components/StudentForm';
import { Student } from '../../types/student';

export default function CreateStudentScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateStudent = async (
    data: Omit<Student, 'id' | 'created_at' | 'updated_at'> & {
        password?: string;
    }
    ) => {
    if (!data.password) {
        throw new Error('La contraseña es obligatoria.');
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
        await createStudent({
        ...data,
        password: data.password,
        email: data.email.trim().toLowerCase(),
        });

        setSuccess('¡Estudiante registrado correctamente!');

        setTimeout(() => {
        router.replace('/(tabs)/students');
        }, 1000);
    } catch (err: any) {
        console.error('Error al registrar estudiante:', err);
        console.error('Respuesta API:', err?.response?.data);

        setError(
        err?.response?.data?.message ||
        'No se pudo registrar el estudiante. Intenta nuevamente.'
        );

        throw err;
    } finally {
        setLoading(false);
    }
    };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          title: 'Agregar estudiante',
          headerBackTitle: 'Regresar',
        }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.icon}>🎓</Text>
          <Text style={styles.title}>Nuevo estudiante</Text>
          <Text style={styles.subtitle}>
            Completa los siguientes datos para registrar un estudiante.
          </Text>
        </View>

        {loading && (
          <ActivityIndicator size="large" color="#2563EB" />
        )}

        {error !== '' && (
          <Text style={styles.error}>{error}</Text>
        )}

        {success !== '' && (
          <Text style={styles.success}>{success}</Text>
        )}

        <StudentForm
          onSubmit={handleCreateStudent}
          onCancel={() => router.back()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
  },
  error: {
    color: '#DC2626',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  success: {
    color: '#16A34A',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});