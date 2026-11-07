
/**
 * Formulario reutilizable para crear y editar estudiantes.
 * Compatible con Web, Android e iOS.
 * Adaptable a modo claro y oscuro.
 */

import { useCallback, useEffect, useState } from 'react';
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import type { Student } from '../types/student';

interface StudentFormProps {
  student?: Student;
  onSubmit: (
    data: Omit<Student, 'id' | 'created_at' | 'updated_at'> & {
      password?: string;
    }
  ) => Promise<void>;
  onCancel: () => void;
}

export default function StudentForm({
  student,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [nombre, setNombre] = useState(student?.nombre || '');
  const [apellido, setApellido] = useState(student?.apellido || '');
  const [matricula, setMatricula] = useState(student?.matricula || '');
  const [email, setEmail] = useState(student?.email || '');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(student);

  const handleSubmit = async () => {
    if (submitting) return;

    setError('');

    // Validar campos obligatorios.
    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !matricula.trim() ||
      !email.trim()
    ) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    // Validar nombre y apellido.
    const nameRegex = /^[\p{L}\s'-]+$/u;

    if (!nameRegex.test(nombre.trim())) {
      setError('El nombre solamente debe contener letras.');
      return;
    }

    if (!nameRegex.test(apellido.trim())) {
      setError('El apellido solamente debe contener letras.');
      return;
    }

    // Validar correo electrónico.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    // Validar contraseña al crear.
    if (!isEditing && !password.trim()) {
      setError('La contraseña es obligatoria.');
      return;
    }

    // Validar longitud de contraseña.
    if (password.trim() && password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setSubmitting(true);

    try {
      const data: Omit<
        Student,
        'id' | 'created_at' | 'updated_at'
      > & { password?: string } = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        matricula: matricula.trim(),
        email: email.trim().toLowerCase(),
      };

      // Enviar contraseña solamente si se escribió una.
      if (password.length > 0) {
        data.password = password;
      }

      await onSubmit(data);

      Keyboard.dismiss();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar el estudiante. Intenta nuevamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setNombre('');
    setApellido('');
    setMatricula('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setError('');
  }, []);

  // Actualizar campos cuando cambia el estudiante.
  useEffect(() => {
    if (student) {
      setNombre(student.nombre || '');
      setApellido(student.apellido || '');
      setMatricula(student.matricula || '');
      setEmail(student.email || '');
    } else {
      resetForm();
    }

    setPassword('');
    setShowPassword(false);
    setError('');
  }, [student?.id, resetForm]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* NOMBRE */}
        <Text style={styles.label}>Nombre</Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresa el nombre"
          placeholderTextColor={colors.secondary}
          value={nombre}
          onChangeText={setNombre}
          editable={!submitting}
          autoCapitalize="words"
          returnKeyType="next"
        />

        {/* APELLIDO */}
        <Text style={styles.label}>Apellido</Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresa el apellido"
          placeholderTextColor={colors.secondary}
          value={apellido}
          onChangeText={setApellido}
          editable={!submitting}
          autoCapitalize="words"
          returnKeyType="next"
        />

        {/* MATRÍCULA */}
        <Text style={styles.label}>Matrícula</Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresa la matrícula"
          placeholderTextColor={colors.secondary}
          value={matricula}
          onChangeText={setMatricula}
          editable={!submitting}
          autoCapitalize="characters"
          returnKeyType="next"
        />

        {/* CORREO */}
        <Text style={styles.label}>Correo electrónico</Text>

        <TextInput
          style={styles.input}
          placeholder="ejemplo@correo.com"
          placeholderTextColor={colors.secondary}
          value={email}
          onChangeText={setEmail}
          editable={!submitting}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />

        {/* CONTRASEÑA */}
        <Text style={styles.label}>
          {isEditing
            ? 'Nueva contraseña (opcional)'
            : 'Contraseña'}
        </Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder={
              isEditing
                ? 'Dejar vacío para conservar la actual'
                : 'Ingresa una contraseña'
            }
            placeholderTextColor={colors.secondary}
            value={password}
            onChangeText={setPassword}
            editable={!submitting}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={styles.showPasswordButton}
            onPress={() => setShowPassword((previous) => !previous)}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel={
              showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
            }
          >
            <Text style={styles.showPasswordText}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* MENSAJE DE ERROR */}
        {error !== '' && (
          <View style={styles.errorContainer}>
            <Text style={styles.error}>
              {error}
            </Text>
          </View>
        )}

        {/* BOTONES */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[
              styles.cancelButton,
              submitting && styles.buttonDisabled,
            ]}
            onPress={onCancel}
            disabled={submitting}
            accessibilityRole="button"
          >
            <Text style={styles.cancelText}>
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
          >
            <Text style={styles.submitText}>
              {submitting
                ? 'Guardando...'
                : isEditing
                  ? 'Actualizar'
                  : 'Crear'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// ESTILOS DINÁMICOS SEGÚN EL TEMA.
function createStyles(
  colors: ReturnType<typeof useTheme>['colors']
) {
  return StyleSheet.create({
    scroll: {
      width: '100%',
      flexGrow: 0,
    },

    scrollContent: {
      flexGrow: 1,
      paddingBottom: 12,
    },

    container: {
      width: '100%',
      backgroundColor: colors.card,
      paddingHorizontal: 4,
      paddingTop: 8,
      paddingBottom: 8,
      borderRadius: 12,
    },

    label: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
      marginBottom: 7,
    },

    input: {
      width: '100%',
      minHeight: 48,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 13,
      paddingVertical: 12,
      marginBottom: 15,
      fontSize: 15,
      color: colors.text,
      backgroundColor: colors.background,
    },

    passwordContainer: {
      width: '100%',
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      marginBottom: 16,
      backgroundColor: colors.background,
      overflow: 'hidden',
    },

    passwordInput: {
      flex: 1,
      minWidth: 0,
      minHeight: 48,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: colors.text,
    },

    showPasswordButton: {
      paddingHorizontal: 12,
      paddingVertical: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },

    showPasswordText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '700',
    },

    errorContainer: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.error,
      borderRadius: 9,
      padding: 12,
      marginBottom: 14,
    },

    error: {
      color: colors.error,
      fontSize: 13,
      textAlign: 'center',
      fontWeight: '500',
    },

    buttons: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      marginTop: 8,
      gap: 10,
    },

    cancelButton: {
      flex: 1,
      minHeight: 48,
      paddingHorizontal: 8,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cancelText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
    },

    submitButton: {
      flex: 1,
      minHeight: 48,
      paddingHorizontal: 8,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    submitButtonDisabled: {
      opacity: 0.6,
    },

    buttonDisabled: {
      opacity: 0.5,
    },

    submitText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
  });
}
