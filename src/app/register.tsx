
/**
 * Pantalla de registro
 */

import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';

export default function RegisterScreen() {
  const router = useRouter();

  const { register, loading, error } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { colors, theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password || !confirmPassword) {
      showError(
        'Campos incompletos',
        'Todos los campos son obligatorios.',
      );
      return;
    }

    if (!cleanEmail.includes('@')) {
      showError(
        'Correo inválido',
        'Ingresa un correo electrónico válido.',
      );
      return;
    }

    if (password !== confirmPassword) {
      showError(
        'Contraseñas diferentes',
        'Las contraseñas no coinciden.',
      );
      return;
    }

    if (password.length < 8) {
      showError(
        'Contraseña inválida',
        'La contraseña debe tener al menos 8 caracteres.',
      );
      return;
    }

    try {
      const success = await register({
        email: cleanEmail,
        password,
      });

      if (success) {
        showSuccess(
          '¡Registro exitoso!',
          'Tu cuenta se creó correctamente.',
        );

        router.replace('/(tabs)/home');
      } else {
        showError(
        'Error al registrar',
        error?.message ||
            'No fue posible crear la cuenta. Inténtalo nuevamente.',
        );
      }
    } catch {
      showError(
        'Error de conexión',
        'No fue posible completar el registro. Verifica tu conexión.',
      );
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <View
            style={[
              styles.logoContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.logoText}>S</Text>
          </View>

          <Text style={[styles.brandName, { color: colors.text }]}>
            SISTEMA
          </Text>

          <Text
            style={[
              styles.brandDescription,
              { color: colors.secondary },
            ]}
          >
            Plataforma de gestión de alumnos
          </Text>
        </View>

        {/* Botón de tema */}
        <View style={styles.themeContainer}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.themeButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={styles.themeIcon}>
              {theme === 'light' ? '🌙' : '☀️'}
            </Text>

            <Text style={[styles.themeText, { color: colors.text }]}>
              {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulario */}
        <View
          style={[
            styles.formCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Crear cuenta
          </Text>

          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            Regístrate para comenzar a utilizar el sistema.
          </Text>

          {/* Correo electrónico */}
          <Text style={[styles.label, { color: colors.text }]}>
            Correo electrónico
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="ejemplo@correo.com"
              placeholderTextColor={colors.secondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              editable={true}
              returnKeyType="next"
            />
          </View>

          {/* Contraseña */}
          <Text style={[styles.label, { color: colors.text }]}>
            Contraseña
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.passwordInput, { color: colors.text }]}
              placeholder="Mínimo 8 caracteres"
              placeholderTextColor={colors.secondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={true}
              returnKeyType="next"
            />

            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={[styles.toggleText, { color: colors.primary }]}>
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Confirmar contraseña */}
          <Text style={[styles.label, { color: colors.text }]}>
            Confirmar contraseña
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.passwordInput, { color: colors.text }]}
              placeholder="Repite tu contraseña"
              placeholderTextColor={colors.secondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={true}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />

            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              <Text style={[styles.toggleText, { color: colors.primary }]}>
                {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Botón de registro */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              { backgroundColor: colors.primary },
              loading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Text>
          </TouchableOpacity>

          {/* Iniciar sesión */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.secondary }]}>
              ¿Ya tienes una cuenta?
            </Text>

            <TouchableOpacity
              onPress={() => router.replace('/')}
              disabled={loading}
            >
              <Text style={[styles.loginLink, { color: colors.primary }]}>
                Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pie de página */}
        <Text style={[styles.footer, { color: colors.secondary }]}>
          Sistema de gestión de alumnos
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 35,
  },
  header: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logoContainer: {
    width: 62,
    height: 62,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  brandName: {
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: 3,
  },
  brandDescription: {
    fontSize: 13,
    marginTop: 5,
  },
  themeContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 20,
    borderWidth: 1,
  },
  themeIcon: {
    fontSize: 15,
    marginRight: 7,
  },
  themeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formCard: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 25,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 11,
    marginBottom: 19,
    paddingHorizontal: 13,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 14,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 14,
    paddingVertical: 0,
  },
  passwordToggle: {
    paddingVertical: 10,
    paddingLeft: 8,
  },
  toggleText: {
    fontWeight: '600',
  },
  registerButton: {
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
    marginTop: 7,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 23,
    gap: 5,
  },
  loginText: {
    fontSize: 13,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 25,
  },
});
