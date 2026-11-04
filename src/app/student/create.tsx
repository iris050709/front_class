
/**
 * Pantalla para registrar un nuevo estudiante
 * Compatible con Web, Android e iOS.
 */

import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';

import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { createStudent } from '../../api/students.api';

export default function CreateStudentScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateStudent = async () => {
    setError('');
    setSuccess('');

    // Validar campos obligatorios
    if (
        !nombre.trim() ||
        !apellido.trim() ||
        !matricula.trim() ||
        !email.trim() ||
        !password.trim()
        ) {
        setError('Todos los campos son obligatorios.');
        return;
        }

        if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.');
        return;
        }

    // Validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);

    try {
      await createStudent({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        matricula: matricula.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      setSuccess('¡Estudiante registrado correctamente!');

      // Regresar a la lista después de guardar
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.icon}>🎓</Text>
          <Text style={styles.title}>Nuevo estudiante</Text>
          <Text style={styles.subtitle}>
            Completa los siguientes datos para registrar un estudiante.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el nombre"
            value={nombre}
            onChangeText={setNombre}
            editable={!loading}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el apellido"
            value={apellido}
            onChangeText={setApellido}
            editable={!loading}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Matrícula</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa la matrícula"
            value={matricula}
            onChangeText={setMatricula}
            editable={!loading}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>

            <TextInput
            style={styles.input}
            placeholder="Ingresa una contraseña"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            secureTextEntry
            autoCapitalize="none"
            />

          {error !== '' && (
            <Text style={styles.error}>{error}</Text>
          )}

          {success !== '' && (
            <Text style={styles.success}>{success}</Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.buttonPressed,
              loading && styles.disabledButton,
            ]}
            onPress={handleCreateStudent}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>
                Registrar estudiante
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.cancelButton}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(tabs)/students');
              }
            }}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  error: {
    color: '#DC2626',
    marginTop: 16,
    textAlign: 'center',
  },
  success: {
    color: '#16A34A',
    marginTop: 16,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
