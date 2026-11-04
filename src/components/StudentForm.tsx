/**
 * Formulario reutilizable para crear y editar estudiantes.
 * Compatible con Web, Android e iOS.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
    setError('');

    // Validar campos vacíos.
    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !matricula.trim() ||
      !email.trim()
    ) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    // Validar que nombre y apellido contengan texto válido.
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

    // Si se proporciona una contraseña, validar su longitud.
    if (password.trim() && password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (submitting) return;

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

  useEffect(() => {
    if (!student) {
      resetForm();
    } else {
      setNombre(student.nombre || '');
      setApellido(student.apellido || '');
      setMatricula(student.matricula || '');
      setEmail(student.email || '');
      setPassword('');
      setShowPassword(false);
      setError('');
    }
  }, [student, resetForm]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        editable={!submitting}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
        editable={!submitting}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Matrícula"
        value={matricula}
        onChangeText={setMatricula}
        editable={!submitting}
        autoCapitalize="characters"
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        editable={!submitting}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Campo de contraseña con mostrar y ocultar */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder={
            isEditing
              ? 'Nueva contraseña (opcional)'
              : 'Contraseña'
          }
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

      {/* Mensaje de validación */}
      {error !== '' && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[
            styles.cancelButton,
            submitting && styles.buttonDisabled,
          ]}
          onPress={onCancel}
          disabled={submitting}
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
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    margin: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },

  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    minWidth: 0,
  },

  showPasswordButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  showPasswordText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },

  error: {
    color: '#DC2626',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    alignItems: 'center',
  },

  cancelText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },

  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
    alignItems: 'center',
  },

  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});