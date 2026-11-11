
/**
 * Pantalla de detalle de estudiante.
 * Compatible con modo claro y oscuro.
 * Incluye notificaciones de éxito y error.
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
import { useAuthContext } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { useApi } from '../../hooks/useApi';
import type { Student } from '../../types/student';

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { user, initializing } = useAuthContext();
  const { colors } = useTheme();

  const { showSuccess, showError } = useNotification();

  const isAdmin = user?.kind === 'user';

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const styles = createStyles(colors);

  const studentId = Number(id);
  const validStudentId = Number.isInteger(studentId) && studentId > 0;

  // Impedir que estudiantes o usuarios sin sesión accedan al detalle.
  useEffect(() => {
    if (!initializing && !isAdmin) {
      router.replace('/(tabs)/home');
    }
  }, [initializing, isAdmin, router]);

  // Consultar estudiante.
  const fetchStudent = useCallback(() => {
    if (!validStudentId) {
      throw new Error('El identificador del estudiante no es válido.');
    }

    return getStudentById(studentId);
  }, [studentId, validStudentId]);

  const {
    data: student,
    loading,
    error,
    execute: loadStudent,
  } = useApi(fetchStudent);

  // Cargar información solamente después de verificar la sesión.
  useEffect(() => {
    if (!initializing && isAdmin && validStudentId) {
      loadStudent();
    }
  }, [initializing, isAdmin, validStudentId, loadStudent]);

  // Mientras se verifica la sesión, no mostrar información.
  if (initializing) {
    return <Loading message="Verificando sesión..." />;
  }

  // Evitar mostrar información a usuarios sin permisos.
  if (!isAdmin) {
    return null;
  }

  // Actualizar estudiante.
  const handleEditStudent = async (
    data: Omit<Student, 'id' | 'created_at' | 'updated_at'> & {
      password?: string;
    }
  ) => {
    if (!isAdmin) {
      const message = 'No tienes permisos para editar estudiantes.';
      showError(message);
      throw new Error(message);
    }

    if (!validStudentId) {
      const message = 'El identificador del estudiante no es válido.';
      showError(message);
      throw new Error(message);
    }

    try {
      await updateStudent(studentId, data);

      setEditModalVisible(false);

      await loadStudent();

      showSuccess('La información del estudiante se actualizó correctamente.');
    } catch (err: unknown) {
      console.error('Error al actualizar estudiante:', err);

      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar la información del estudiante.';

      showError(message);
      throw err;
    }
  };

  // Abrir confirmación de eliminación.
  const openDeleteModal = () => {
    if (!isAdmin) {
      showError('No tienes permisos para eliminar estudiantes.');
      return;
    }

    setModalVisible(true);
  };

  // Eliminar estudiante.
  const handleDelete = async () => {
    if (!isAdmin) {
      setModalVisible(false);
      showError('No tienes permisos para eliminar estudiantes.');
      return;
    }

    if (!validStudentId) {
      setModalVisible(false);
      showError('El identificador del estudiante no es válido.');
      return;
    }

    setDeleting(true);

    try {
      await deleteStudent(studentId);

      setModalVisible(false);

      showSuccess('El estudiante se eliminó correctamente.');

      router.replace('/(tabs)/students');
    } catch (err: unknown) {
      console.error('Error al eliminar estudiante:', err);

      setModalVisible(false);

      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el estudiante. Intenta nuevamente.';

      showError(message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando estudiante..." />;
  }

  if (error || !student) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          error={error || 'Estudiante no encontrado'}
          onRetry={loadStudent}
        />
      </View>
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
                {student.matricula || 'No disponible'}
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
                  {student.email || 'No disponible'}
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
                  {student.matricula || 'No disponible'}
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
          {isAdmin && (
            <View style={styles.actionsSection}>
              <Text style={styles.actionsTitle}>
                Administración
              </Text>

              <Text style={styles.actionsSubtitle}>
                Gestiona la información de este estudiante
              </Text>

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

                <Text style={styles.deleteArrow}>›</Text>
              </Pressable>
            </View>
          )}

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
              ¿Estás seguro de que deseas eliminar a{' '}
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

// ESTILOS DINÁMICOS SEGÚN EL TEMA.
function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({

    // CONTENEDOR GENERAL
    container: {
      flex: 1,
      backgroundColor: colors.background,
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

    // TARJETAS
    section: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
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
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },

    sectionIconText: {
      fontSize: 20,
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 3,
    },

    sectionSubtitle: {
      fontSize: 12,
      color: colors.secondary,
    },

    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 8,
    },

    // INFORMACIÓN
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 13,
    },

    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 11,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },

    infoContent: {
      flex: 1,
    },

    label: {
      fontSize: 12,
      color: colors.secondary,
      fontWeight: '500',
      marginBottom: 5,
    },

    value: {
      fontSize: 15,
      color: colors.text,
      fontWeight: '600',
    },

    // FECHAS
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    dateIndicator: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },

    dateIndicatorUpdated: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: colors.background,
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
      backgroundColor: colors.background,
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 7,
    },

    statusText: {
      color: colors.primary,
      fontSize: 10,
      fontWeight: '700',
    },

    // ACCIONES
    actionsSection: {
      backgroundColor: colors.card,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
    },

    actionsTitle: {
      fontSize: 18,
      color: colors.text,
      fontWeight: '800',
      marginBottom: 5,
    },

    actionsSubtitle: {
      fontSize: 13,
      color: colors.secondary,
      marginBottom: 20,
    },

    editButton: {
      width: '100%',
      minHeight: 54,
      backgroundColor: colors.primary,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 18,
      marginBottom: 12,
    },

    deleteButton: {
      width: '100%',
      minHeight: 54,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: '#DC2626',
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
      color: '#EF4444',
      fontSize: 15,
      fontWeight: '700',
    },

    buttonArrow: {
      fontSize: 27,
      color: '#FFFFFF',
      fontWeight: '300',
    },

    deleteArrow: {
      fontSize: 27,
      color: '#EF4444',
      fontWeight: '300',
    },

    buttonPressed: {
      opacity: 0.75,
      transform: [{ scale: 0.99 }],
    },

    footerText: {
      textAlign: 'center',
      color: colors.secondary,
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
      backgroundColor: colors.card,
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
      color: colors.text,
      marginBottom: 5,
    },

    modalSubtitle: {
      fontSize: 12,
      color: colors.secondary,
    },

    closeButton: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },

    closeButtonText: {
      fontSize: 17,
      color: colors.text,
      fontWeight: '700',
    },

    // CONFIRMACIÓN
    confirmModal: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 25,
      alignItems: 'center',
    },

    warningIcon: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: '#DC2626',
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
      color: colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },

    confirmMessage: {
      fontSize: 14,
      color: colors.secondary,
      lineHeight: 22,
      textAlign: 'center',
      marginBottom: 12,
    },

    confirmStudentName: {
      fontWeight: '800',
      color: colors.text,
    },

    confirmNote: {
      fontSize: 12,
      color: colors.secondary,
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
      backgroundColor: colors.background,
      paddingVertical: 13,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cancelButtonText: {
      color: colors.text,
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
}
