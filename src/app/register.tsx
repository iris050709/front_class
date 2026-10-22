import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ErrorMessage } from '../components/ErrorMessage';
import { Loading } from '../components/Loading';
import { useAuth } from '../hooks/useAuth';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    matricula: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register, loading, error, clearError } = useAuth();
  const router = useRouter();

  const updateForm = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!form.nombre || !form.apellido || !form.matricula || 
        !form.email || !form.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (form.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const success = await register({
      nombre: form.nombre,
      apellido: form.apellido,
      matricula: form.matricula,
      email: form.email,
      password: form.password,
    });

    if (success) {
      Alert.alert('Éxito', 'Cuenta creada exitosamente');
      router.replace('/home');
    }
  };

  if (loading) {
    return <Loading fullScreen message="Creando cuenta..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Completa tus datos</Text>
        </View>

        {error && (
          <ErrorMessage error={error} onDismiss={clearError} />
        )}

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.half]}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Juan"
                value={form.nombre}
                onChangeText={(v) => updateForm('nombre', v)}
              />
            </View>

            <View style={[styles.inputContainer, styles.half]}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholder="Pérez"
                value={form.apellido}
                onChangeText={(v) => updateForm('apellido', v)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Matrícula</Text>
            <TextInput
              style={styles.input}
              placeholder="A00123456"
              value={form.matricula}
              onChangeText={(v) => updateForm('matricula', v)}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              value={form.email}
              onChangeText={(v) => updateForm('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChangeText={(v) => updateForm('password', v)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              value={form.confirmPassword}
              onChangeText={(v) => updateForm('confirmPassword', v)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => router.back()}
          >
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});