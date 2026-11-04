
/**
 * Pantalla de detalle de estudiante
 * Diseño profesional compatible con Web, Android e iOS.
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

import {
  deleteStudent,
  getStudentById,
  updateStudent,
} from '../../api/students.api';

import { ErrorMessage, Loading } from '../../components';
import StudentForm from '../../components/StudentForm';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../hooks/useAuth';
import type { Student } from '../../types/student';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const isAdmin = user?.kind === 'user';

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Consultar estudiante.
  const fetchStudent = useCallback(() => {
    return getStudentById(Number(id));
  }, [id]);

  const {
    data: student,
    loading,
    error,
    execute: loadStudent,
  } = useApi(fetchStudent);

  // Actualizar estudiante.
  const handleEditStudent = async (
    data: Omit<Student, 'id' | 'created_at' | 'updated_at'> & {
      password?: string;
    }
  ) => {
    if (!isAdmin) {
      throw new Error('No tienes permisos para editar estudiantes.');
    }

    const studentId = Number(id);

    if (!Number.isInteger(studentId) || studentId <= 0) {
      throw new Error('El identificador del estudiante no es válido.');
    }

    await updateStudent(studentId, data);

    setEditModalVisible(false);

    await loadStudent();
  };

  // Cargar información.
  useEffect(() => {
    loadStudent();
  }, [id, loadStudent]);

  // Abrir confirmación de eliminación.
  const openDeleteModal = () => {
    setDeleteError('');
    setModalVisible(true);
  };

  // Eliminar estudiante.
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
      router.replace('/(tabs)/students');

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

  const initials =
    `${student.nombre?.charAt(0) || '?'}${student.apellido?.charAt(0) || '?'}`;

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Fecha no disponible';
    }

    return parsedDate.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Detalle del estudiante',
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          {/* ENCABEZADO PRINCIPAL */}
          <View style={styles.header}>
            <View style={styles.headerDecoration} />

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {initials.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.headerSubtitle}>
              PERFIL DEL ESTUDIANTE
            </Text>

            <Text style={styles.name}>
              {student.nombre} {student.apellido}
            </Text>

            <View style={styles.matriculaBadge}>
              <Text style={styles.matriculaLabel}>
                MATRÍCULA
              </Text>
              <Text style={styles.matriculaValue}>
                {student.matricula}
              </Text>
            </View>
          </View>

          {/* INFORMACIÓN PERSONAL */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Text style={styles.sectionIconText}>👤</Text>
              </View>

              <View>
                <Text style={styles.sectionTitle}>
                  Información personal
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Datos generales del estudiante
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text>📧</Text>
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>Correo electrónico</Text>
                <Text style={styles.value}>
                  {student.email}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text>🆔</Text>
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>Identificador</Text>
                <Text style={styles.value}>
                  #{student.id}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text>🎓</Text>
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.label}>Matrícula</Text>
                <Text style={styles.value}>
                  {student.matricula}
                </Text>
              </View>
            </View>
          </View>

          {/* INFORMACIÓN DE REGISTRO */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Text style={styles.sectionIconText}>📅</Text>
              </View>

              <View>
                <Text style={styles.sectionTitle}>
                  Información de registro
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Historial de actividad del estudiante
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.dateRow}>
              <View style={styles.dateIndicator}>
                <Text style={styles.dateEmoji}>🗓️</Text>
              </View>

              <View style={styles.dateContent}>
                <Text style={styles.label}>
                  Fecha de creación
                </Text>
                <Text style={styles.value}>
                  {formatDate(student.created_at)}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  Registro
                </Text>
              </View>
            </View>

            <View style={styles.dateRow}>
              <View style={styles.dateIndicatorUpdated}>
                <Text style={styles.dateEmoji}>🔄</Text>
              </View>

              <View style={styles.dateContent}>
                <Text style={styles.label}>
                  Última actualización
                </Text>
                <Text style={styles.value}>
                  {formatDate(student.updated_at)}
                </Text>
              </View>
            </View>
          </View>

          {/* ACCIONES */}
          <View style={styles.actionsSection}>
            <Text style={styles.actionsTitle}>
              Administración
            </Text>

            <Text style={styles.actionsSubtitle}>
              Gestiona la información de este estudiante
            </Text>

            {isAdmin && (
              <Pressable
                style={({ pressed }) => [
                  styles.editButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => setEditModalVisible(true)}
              >
                <Text style={styles.buttonIcon}>✏️</Text>
                <Text style={styles.editButtonText}>
                  Editar estudiante
                </Text>
                <Text style={styles.buttonArrow}>›</Text>
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={openDeleteModal}
              disabled={deleting}
            >
              <Text style={styles.buttonIcon}>🗑️</Text>
              <Text style={styles.deleteButtonText}>
                Eliminar estudiante
              </Text>
              <Text style={styles.buttonArrow}>›</Text>
            </Pressable>

            {deleteError !== '' && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {deleteError}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.footerText}>
            Sistema de gestión de estudiantes
          </Text>

        </View>
      </ScrollView>

      {/* MODAL DE EDICIÓN */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContainer}>

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  Editar estudiante
                </Text>
                <Text style={styles.modalSubtitle}>
                  Actualiza la información del estudiante
                </Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.divider} />

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <StudentForm
                student={student}
                onCancel={() => setEditModalVisible(false)}
                onSubmit={handleEditStudent}
              />
            </ScrollView>

          </View>
        </View>
      </Modal>

      {/* MODAL DE CONFIRMACIÓN */}
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
          <View style={styles.confirmModal}>

            <View style={styles.warningIcon}>
              <Text style={styles.warningIconText}>!</Text>
            </View>

            <Text style={styles.confirmTitle}>
              Eliminar estudiante
            </Text>

            <Text style={styles.confirmMessage}>
              ¿Estás seguro de que deseas eliminar a
              {' '}
              <Text style={styles.confirmStudentName}>
                {student.nombre} {student.apellido}
              </Text>
              ?
            </Text>

            <Text style={styles.confirmNote}>
              Esta acción eliminará el registro del estudiante.
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => setModalVisible(false)}
                disabled={deleting}
              >
                <Text style={styles.cancelButtonText}>
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.confirmButton,
                  deleting && styles.disabledButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleDelete}
                disabled={deleting}
              >
                <Text style={styles.confirmButtonText}>
                  {deleting ? 'Eliminando...' : 'Sí, eliminar'}
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

  // CONTENEDOR GENERAL
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },

  content: {
    width: '100%',
    maxWidth: 850,
    alignSelf: 'center',
  },

  // ENCABEZADO
  header: {
    backgroundColor: '#172554',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  headerDecoration: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#1E40AF',
    opacity: 0.35,
    top: -140,
    right: -70,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#DBEAFE',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  avatarText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1D4ED8',
  },

  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#BFDBFE',
    marginBottom: 8,
  },

  name: {
    fontSize: 25,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 18,
  },

  matriculaBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 10,
    alignItems: 'center',
  },

  matriculaLabel: {
    color: '#BFDBFE',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
  },

  matriculaValue: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  // TARJETAS DE INFORMACIÓN
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },

  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionIconText: {
    fontSize: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 8,
  },

  // FILAS DE INFORMACIÓN
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 13,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoContent: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 5,
  },

  value: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
  },

  // FECHAS
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  dateIndicator: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateIndicatorUpdated: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateEmoji: {
    fontSize: 19,
  },

  dateContent: {
    flex: 1,
  },

  statusBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
  },

  statusText: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '700',
  },

  // ACCIONES
  actionsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },

  actionsTitle: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: '800',
    marginBottom: 5,
  },

  actionsSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 20,
  },

  editButton: {
    width: '100%',
    minHeight: 54,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  deleteButton: {
    width: '100%',
    minHeight: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },

  buttonIcon: {
    fontSize: 19,
    marginRight: 12,
  },

  editButtonText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  deleteButtonText: {
    flex: 1,
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '700',
  },

  buttonArrow: {
    fontSize: 27,
    color: '#FFFFFF',
    fontWeight: '300',
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  errorContainer: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    textAlign: 'center',
  },

  footerText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 5,
  },

  // MODALES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  editModalContainer: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 5,
  },

  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 17,
    color: '#475569',
    fontWeight: '700',
  },

  // CONFIRMACIÓN
  confirmModal: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },

  warningIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 17,
  },

  warningIconText: {
    fontSize: 29,
    color: '#DC2626',
    fontWeight: '800',
  },

  confirmTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },

  confirmMessage: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 12,
  },

  confirmStudentName: {
    fontWeight: '800',
    color: '#0F172A',
  },

  confirmNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
  },

  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 14,
  },

  confirmButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  disabledButton: {
    opacity: 0.5,
  },
});
