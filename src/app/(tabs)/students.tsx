/**
 * Pantalla de lista de estudiantes.
 * Compatible con Web, Android e iOS.
 * Solamente permite el acceso a usuarios de tipo "user".
 * Compatible con tema claro y oscuro.
 */

import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';


import { ErrorMessage, Loading } from '../../components';
import StudentList from '../../components/StudentList';
import { useAuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useStudents } from '../../hooks/useStudents';

export default function StudentsScreen() {
  const router = useRouter();

  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const { user, initializing } = useAuthContext();
  const { showSuccess, showInfo, showError } = useNotification();

  // Evitar hacer una segunda consulta al entrar por primera vez.
  // La carga inicial ya la realiza useStudents.
  const firstFocus = useRef(true);

  const {
    students,
    loading,
    error,
    refresh,
    deleteStudent,
  } = useStudents();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [modalMessage, setModalMessage] = useState('');

  const [modalType, setModalType] = useState<
    'confirm' | 'error' | 'success'
  >('confirm');

  // Colores del modal según el tema.
  const modalColors = {
    confirm: {
      background: isDark ? '#422F17' : '#FEF3C7',
      border: isDark ? '#78551F' : '#FDE68A',
      icon: '#D97706',
      button: '#DC2626',
    },
    success: {
      background: isDark ? '#163D2B' : '#DCFCE7',
      border: isDark ? '#236344' : '#BBF7D0',
      icon: '#16A34A',
      button: colors.primary,
    },
    error: {
      background: isDark ? '#44232A' : '#FEE2E2',
      border: isDark ? '#713743' : '#FECACA',
      icon: '#DC2626',
      button: colors.primary,
    },
  };

  // Bloquear el acceso a estudiantes.
  useEffect(() => {
    if (initializing) return;

    if (user && user.kind !== 'user') {
      router.replace('/(tabs)/profile');
    }
  }, [user, initializing, router]);

  // Actualizar automáticamente al regresar a la lista.
  useFocusEffect(
    useCallback(() => {
      // La primera carga ya se realiza desde useStudents.
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }

      // Consultar nuevamente cuando la pantalla recupera el foco.
      refresh().catch(error => {
        console.error(
          'ERROR AL ACTUALIZAR AUTOMÁTICAMENTE:',
          error
        );

        showError(
          'Error de actualización',
          'No se pudo actualizar la lista de estudiantes.'
        );
      });

    }, [refresh, showError])
  );

  // Abrir detalle del estudiante.
  const handleStudentPress = (student: { id: number }) => {
    if (user?.kind !== 'user') {
      router.replace('/(tabs)/profile');
      return;
    }

    router.push(`/student/${student.id}`);
  };

  // Abrir confirmación de eliminación.
  const handleDeleteStudent = (id: number) => {
    if (user?.kind !== 'user') {
      return;
    }

    setSelectedStudentId(id);
    setModalType('confirm');

    setModalMessage(
      '¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer.'
    );

    setModalVisible(true);
  };

  // Confirmar eliminación.
  const confirmDelete = async () => {
    if (selectedStudentId === null || user?.kind !== 'user') {
      return;
    }

    setDeleting(true);

    try {
      await deleteStudent(selectedStudentId);

      setModalType('success');
      setModalMessage(
        'El estudiante se eliminó correctamente del sistema.'
      );

      await refresh();

    } catch (error: any) {
      console.error('ERROR AL ELIMINAR ESTUDIANTE:', error);
      console.error('Respuesta del servidor:', error?.response?.data);
      console.error('Código HTTP:', error?.response?.status);

      setModalType('error');

      setModalMessage(
        error?.response?.data?.message ||
        'No se pudo eliminar el estudiante. Intenta nuevamente.'
      );

    } finally {
      setDeleting(false);
      setSelectedStudentId(null);
    }
  };

  // Actualizar lista manualmente.
  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      const changed = await refresh();

      if (changed) {
        showSuccess(
          'Lista actualizada',
          'Se encontraron cambios en los estudiantes.'
        );
      } else {
        showInfo(
          'Sin cambios',
          'La lista ya está actualizada.'
        );
      }

    } catch (error) {
      console.error('ERROR AL ACTUALIZAR:', error);

      showError(
        'Error de actualización',
        'No se pudo actualizar la lista. Intenta nuevamente.'
      );

    } finally {
      setRefreshing(false);
    }
  }, [refresh, refreshing, showSuccess, showInfo, showError]);

  // Cerrar modal.
  const closeModal = () => {
    if (deleting) return;

    setModalVisible(false);
    setSelectedStudentId(null);
  };

  // Verificar sesión.
  if (initializing || !user) {
    return <Loading message="Verificando sesión..." />;
  }

  if (user.kind !== 'user') {
    return <Loading message="Redirigiendo..." />;
  }

  if (loading && !refreshing) {
    return <Loading message="Cargando estudiantes..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={refresh}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* CONTENIDO PRINCIPAL */}
      <View style={styles.content}>

        {/* ENCABEZADO */}
        <View
          style={[
            styles.pageHeader,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.headerTop}>
            <View style={styles.headerTextContainer}>
              <Text
                style={[
                  styles.headerEyebrow,
                  { color: colors.primary },
                ]}
              >
                PANEL DE ADMINISTRACIÓN
              </Text>

              <Text style={[styles.title, { color: colors.text }]}>
                Gestión académica
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  { color: colors.secondary },
                ]}
              >
                Administra y consulta los estudiantes registrados en el sistema.
              </Text>
            </View>

            <View
              style={[
                styles.headerIcon,
                { backgroundColor: isDark ? '#1E3A5F' : '#EFF6FF' },
              ]}
            >
              <Text style={styles.headerIconText}>🎓</Text>
            </View>
          </View>

          <View
            style={[
              styles.headerDivider,
              { backgroundColor: colors.border },
            ]}
          />

          {/* RESUMEN Y ACTUALIZACIÓN */}
          <View style={styles.headerActions}>

            <View style={styles.summaryCard}>
              <View
                style={[
                  styles.summaryIcon,
                  { backgroundColor: isDark ? '#1E3A5F' : '#EFF6FF' },
                ]}
              >
                <Text style={styles.summaryIconText}>👥</Text>
              </View>

              <View style={styles.summaryContent}>
                <Text style={[styles.summaryNumber, { color: colors.text }]}>
                  {students.length}
                </Text>

                <Text
                  style={[
                    styles.summaryLabel,
                    { color: colors.secondary },
                  ]}
                >
                  Estudiantes registrados
                </Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.refreshButton,
                {
                  backgroundColor: isDark ? '#1E3A5F' : '#EFF6FF',
                  borderColor: isDark ? '#315780' : '#BFDBFE',
                },
                pressed && styles.buttonPressed,
                refreshing && styles.refreshButtonDisabled,
              ]}
              onPress={onRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                />
              ) : (
                <Text
                  style={[
                    styles.refreshIcon,
                    { color: colors.primary },
                  ]}
                >
                  ↻
                </Text>
              )}

              <Text
                style={[
                  styles.refreshButtonText,
                  { color: isDark ? '#93C5FD' : '#1D4ED8' },
                ]}
              >
                {refreshing ? 'Actualizando' : 'Actualizar'}
              </Text>
            </Pressable>

          </View>
        </View>

        {/* LISTA DE ESTUDIANTES */}
        <View style={styles.listContainer}>
          <StudentList
            students={students}
            onStudentPress={handleStudentPress}
            onDeleteStudent={handleDeleteStudent}
          />
        </View>

        {/* PIE DE PÁGINA */}
        <Text
          style={[
            styles.footerText,
            { color: colors.secondary },
          ]}
        >
          Sistema de gestión de estudiantes
        </Text>

      </View>

      {/* MODAL DE CONFIRMACIÓN, ÉXITO Y ERROR */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeModal}
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

            {/* ICONO SEGÚN EL ESTADO */}
            <View
              style={[
                styles.modalIconContainer,
                {
                  backgroundColor: modalColors[modalType].background,
                  borderColor: modalColors[modalType].border,
                },
              ]}
            >
              <Text
                style={[
                  styles.modalIcon,
                  { color: modalColors[modalType].icon },
                ]}
              >
                {modalType === 'confirm'
                  ? '!'
                  : modalType === 'success'
                    ? '✓'
                    : '✕'}
              </Text>
            </View>

            {/* TÍTULO */}
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {modalType === 'confirm'
                ? 'Eliminar estudiante'
                : modalType === 'success'
                  ? 'Operación completada'
                  : 'No se pudo completar'}
            </Text>

            {/* MENSAJE */}
            <Text
              style={[
                styles.modalMessage,
                { color: colors.secondary },
              ]}
            >
              {modalMessage}
            </Text>

            {/* BOTONES */}
            {modalType === 'confirm' ? (

              <View style={styles.modalButtons}>

                <Pressable
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.cancelButton,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={closeModal}
                  disabled={deleting}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                    Cancelar
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.deleteButton,
                    deleting && styles.disabledButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text style={styles.deleteButtonText}>
                      Eliminar
                    </Text>
                  )}
                </Pressable>

              </View>

            ) : (

              <Pressable
                style={({ pressed }) => [
                  styles.acceptButton,
                  { backgroundColor: modalColors[modalType].button },
                  pressed && styles.buttonPressed,
                ]}
                onPress={closeModal}
              >
                <Text style={styles.acceptButtonText}>
                  Aceptar
                </Text>
              </Pressable>

            )}

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  // CONTENEDOR PRINCIPAL
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 12,
  },

  // ENCABEZADO
  pageHeader: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
  },

  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerIconText: {
    fontSize: 27,
  },

  headerDivider: {
    height: 1,
    marginVertical: 18,
  },

  // RESUMEN
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryIconText: {
    fontSize: 19,
  },

  summaryContent: {
    justifyContent: 'center',
  },

  summaryNumber: {
    fontSize: 21,
    fontWeight: '800',
  },

  summaryLabel: {
    fontSize: 11,
    fontWeight: '500',
  },

  // ACTUALIZAR
  refreshButton: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  refreshButtonDisabled: {
    opacity: 0.7,
  },

  refreshIcon: {
    fontSize: 20,
    fontWeight: '700',
  },

  refreshButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // LISTA
  listContainer: {
    flex: 1,
    minHeight: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },

  // PIE DE PÁGINA
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 12,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    borderWidth: 1,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },

  // ICONOS DEL MODAL
  modalIconContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  modalIcon: {
    fontSize: 27,
    fontWeight: '800',
  },

  // TEXTOS DEL MODAL
  modalTitle: {
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },

  modalMessage: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 25,
  },

  // BOTONES DEL MODAL
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButton: {
    borderWidth: 1,
  },

  cancelButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },

  deleteButton: {
    backgroundColor: '#DC2626',
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  acceptButton: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },

  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonPressed: {
    opacity: 0.75,
  },

});