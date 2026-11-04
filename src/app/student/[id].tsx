
/**
 * Pantalla de detalle de estudiante
 * Compatible con Web, Android e iOS.
 */

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { deleteStudent, getStudentById } from '../../api/students.api';
import { ErrorMessage, Loading } from '../../components';
import { useApi } from '../../hooks/useApi';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Mantener estable la función que consulta al estudiante.
  const fetchStudent = useCallback(() => {
    return getStudentById(Number(id));
  }, [id]);

  const {
    data: student,
    loading,
    error,
    execute: loadStudent,
  } = useApi(fetchStudent);

  // Cargar estudiante cuando cambie su identificador.
  useEffect(() => {
    loadStudent();
  }, [id, loadStudent]);

  // Abrir confirmación.
  const openDeleteModal = () => {
    setDeleteError('');
    setModalVisible(true);
  };

  // Ejecutar eliminación.
  const handleDelete = async () => {
    const studentId = Number(id);

    if (!id || !Number.isInteger(studentId) || studentId <= 0) {
      setDeleteError('El identificador del estudiante no es válido.');
      setModalVisible(false);
      return;
    }

    setDeleting(true);
    setDeleteError('');

    try {
      await deleteStudent(studentId);

      setModalVisible(false);
      router.replace("/(tabs)/students");

    } catch (err: any) {
      console.error('Error al eliminar estudiante:', err);
      console.error('Respuesta API:', err?.response?.data);
      console.error('Estado HTTP:', err?.response?.status);

      setModalVisible(false);

      setDeleteError(
        err?.response?.data?.message ||
        'No se pudo eliminar el estudiante. Intenta nuevamente.'
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando estudiante..." />;
  }

  if (error || !student) {
    return (
      <ErrorMessage
        error={error || 'Estudiante no encontrado'}
        onRetry={loadStudent}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `${student.nombre} ${student.apellido}`,
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Información principal */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {student.nombre?.charAt(0) || '?'}
              {student.apellido?.charAt(0) || '?'}
            </Text>
          </View>

          <Text style={styles.name}>
            {student.nombre} {student.apellido}
          </Text>

          <Text style={styles.matricula}>
            Matrícula: {student.matricula}
          </Text>
        </View>

        {/* Información de contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Información de contacto
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.icon}>📧</Text>
            <View style={styles.infoContent}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{student.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.icon}>🆔</Text>
            <View style={styles.infoContent}>
              <Text style={styles.label}>ID</Text>
              <Text style={styles.value}>{student.id}</Text>
            </View>
          </View>
        </View>

        {/* Fechas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fechas</Text>

          <View style={styles.infoRow}>
            <Text style={styles.icon}>📅</Text>
            <View style={styles.infoContent}>
              <Text style={styles.label}>Creado</Text>
              <Text style={styles.value}>
                {new Date(student.created_at).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.icon}>🔄</Text>
            <View style={styles.infoContent}>
              <Text style={styles.label}>Actualizado</Text>
              <Text style={styles.value}>
                {new Date(student.updated_at).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Botón eliminar */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={openDeleteModal}
            disabled={deleting}
          >
            <Text style={styles.deleteButtonText}>
              🗑️ Eliminar estudiante
            </Text>
          </Pressable>

          {deleteError !== '' && (
            <Text style={styles.errorText}>
              {deleteError}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Modal de confirmación */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!deleting) {
            setModalVisible(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Eliminar estudiante
            </Text>

            <Text style={styles.modalMessage}>
              ¿Estás seguro de que deseas eliminar a{' '}
              {student.nombre} {student.apellido}?
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
                disabled={deleting}
              >
                <Text style={styles.cancelButtonText}>
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  deleting && styles.disabledButton,
                ]}
                onPress={handleDelete}
                disabled={deleting}
              >
                <Text style={styles.confirmButtonText}>
                  {deleting ? 'Eliminando...' : 'Eliminar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  matricula: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#111827',
  },
  actions: {
    padding: 20,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  errorText: {
    color: '#DC2626',
    marginTop: 12,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#DC2626',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
