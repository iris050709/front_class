
/**
 * Pantalla para registrar una nueva cuenta administradora.
 * Compatible con Web, Android e iOS.
 */

import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';

export default function CreateUserScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const {
    user,
    initializing,
    createAdmin,
    error,
    clearError,
  } = useAuthContext();

  const { showSuccess, showError, showWarning } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  // Restringir el acceso a usuarios administradores.
  useEffect(() => {
    if (initializing) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (user.kind !== 'user') {
      router.replace('/(tabs)/home');
    }
  }, [user, initializing, router]);

  if (initializing || !user || user.kind !== 'user') {
    return null;
  }

  // Regresar a la pantalla anterior.
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  // Validar formulario.
  const validateForm = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail && !password && !confirmPassword) {
      showWarning(
        'Debes completar todos los campos para registrar un usuario.'
      );
      return false;
    }

    if (!normalizedEmail) {
      showWarning('Ingresa el correo electrónico del nuevo usuario.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      showWarning('Ingresa un correo electrónico válido.');
      return false;
    }

    if (!password) {
      showWarning('Ingresa una contraseña.');
      return false;
    }

    if (password.length < 6) {
      showWarning('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    if (!confirmPassword) {
      showWarning('Debes confirmar la contraseña.');
      return false;
    }

    if (password !== confirmPassword) {
      showWarning('Verifica que ambas contraseñas sean iguales.');
      return false;
    }

    return true;
  };

  // Abrir confirmación de registro.
  const confirmCreateUser = () => {
    if (loading || !validateForm()) return;

    setConfirmModalVisible(true);
  };

  // Crear usuario administrador mediante AuthContext.
  const handleCreateUser = async () => {
    if (loading) return;

    const normalizedEmail = email.trim().toLowerCase();

    setConfirmModalVisible(false);
    setLoading(true);
    clearError();

    try {
      const success = await createAdmin({
        email: normalizedEmail,
        password,
      });

      if (!success) {
        showError(
          error?.message ||
            'No se pudo crear el usuario. Verifica los datos e inténtalo nuevamente.'
        );
        return;
      }

      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);

      showSuccess('La cuenta administradora se creó correctamente.');

      setTimeout(() => {
        handleGoBack();
      }, 1000);
    } catch (err: unknown) {
      console.error('Error al crear usuario:', err);

      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo crear el usuario. Verifica tu conexión e inténtalo nuevamente.';

      showError(message);
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
          title: 'Agregar usuario',
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
          headerBackTitle: 'Regresar',
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
              <Text style={styles.icon}>👤</Text>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              Agregar usuario
            </Text>

            <Text style={[styles.subtitle, { color: colors.secondary }]}>
              Registra una nueva cuenta administradora.
            </Text>
          </View>

          {/* Formulario */}
          <View
            style={[
              styles.form,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Correo */}
            <Text style={[styles.label, { color: colors.text }]}>
              Correo electrónico
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="usuario@correo.com"
              placeholderTextColor={colors.secondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            {/* Contraseña */}
            <Text style={[styles.label, { color: colors.text }]}>
              Contraseña
            </Text>

            <View
              style={[
                styles.passwordContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <TextInput
                style={[styles.passwordInput, { color: colors.text }]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />

              <TouchableOpacity
                style={styles.showButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.showButtonText,
                    { color: colors.primary },
                  ]}
                >
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
                styles.passwordContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <TextInput
                style={[styles.passwordInput, { color: colors.text }]}
                placeholder="Repite la contraseña"
                placeholderTextColor={colors.secondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />

              <TouchableOpacity
                style={styles.showButton}
                onPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                disabled={loading}
              >
                <Text
                  style={[
                    styles.showButtonText,
                    { color: colors.primary },
                  ]}
                >
                  {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Información */}
            <View
              style={[
                styles.info,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.infoTitle, { color: colors.primary }]}>
                Información de la cuenta
              </Text>

              <Text style={[styles.infoText, { color: colors.secondary }]}>
                Esta cuenta tendrá permisos de administrador y podrá gestionar
                estudiantes.
              </Text>
            </View>

            {/* Crear usuario */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: colors.primary },
                loading && styles.disabledButton,
              ]}
              onPress={confirmCreateUser}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitText}>
                  Crear usuario
                </Text>
              )}
            </TouchableOpacity>

            {/* Cancelar */}
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
                loading && styles.disabledButton,
              ]}
              onPress={handleGoBack}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={[styles.cancelText, { color: colors.secondary }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal de confirmación */}
      <Modal
        visible={confirmModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.modalIcon,
                { backgroundColor: colors.background },
              ]}
            >
              <Text style={[styles.modalIconText, { color: colors.primary }]}>
                ?
              </Text>
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Confirmar registro
            </Text>

            <Text style={[styles.modalMessage, { color: colors.secondary }]}>
              ¿Deseas crear una cuenta administradora para{' '}
              {email.trim().toLowerCase()}?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalCancelButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setConfirmModalVisible(false)}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.modalCancelText,
                    { color: colors.secondary },
                  ]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalConfirmButton,
                  { backgroundColor: colors.primary },
                  loading && styles.disabledButton,
                ]}
                onPress={handleCreateUser}
                disabled={loading}
              >
                <Text style={styles.modalConfirmText}>
                  Sí, crear
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  form: {
    width: '100%',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  passwordContainer: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  showButton: {
    paddingHorizontal: 12,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  info: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  submitButton: {
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
