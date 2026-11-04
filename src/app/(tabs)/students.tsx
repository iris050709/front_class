
/**
 * Pantalla de lista de estudiantes.
 * Compatible con Web, Android e iOS.
 * Solamente permite el acceso a usuarios de tipo "user".
 * Diseño profesional y moderno.
 */

import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { ErrorMessage, Loading } from '../../components';
import StudentList from '../../components/StudentList';
import { useStudents } from '../../hooks/useStudents';
import { RootState } from '../../store/store';

export default function StudentsScreen() {
  const router = useRouter();

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

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

  // Bloquear el acceso a estudiantes.
  useEffect(() => {
    if (user && user.kind !== 'user') {
      router.replace('/(tabs)/profile');
    }
  }, [user, router]);

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

  // Actualizar lista.
  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh, refreshing]);

  // Cerrar modal.
  const closeModal = () => {
    if (deleting) return;

    setModalVisible(false);
    setSelectedStudentId(null);
  };

  // Verificar sesión.
  if (!user) {
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
    <View style={styles.container}>

      {/* CONTENIDO PRINCIPAL */}
      <View style={styles.content}>

        {/* ENCABEZADO */}
        <View style={styles.pageHeader}>

          <View style={styles.headerTop}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerEyebrow}>
                PANEL DE ADMINISTRACIÓN
              </Text>

              <Text style={styles.title}>
                Gestión académica
              </Text>

              <Text style={styles.subtitle}>
                Administra y consulta los estudiantes registrados en el sistema.
              </Text>
            </View>

            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>🎓</Text>
            </View>
          </View>

          <View style={styles.headerDivider} />

          {/* RESUMEN Y ACTUALIZACIÓN */}
          <View style={styles.headerActions}>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Text style={styles.summaryIconText}>👥</Text>
              </View>

              <View style={styles.summaryContent}>
                <Text style={styles.summaryNumber}>
                  {students.length}
                </Text>

                <Text style={styles.summaryLabel}>
                  Estudiantes registrados
                </Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.refreshButton,
                pressed && styles.buttonPressed,
                refreshing && styles.refreshButtonDisabled,
              ]}
              onPress={onRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                />
              ) : (
                <Text style={styles.refreshIcon}>↻</Text>
              )}

              <Text style={styles.refreshButtonText}>
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
        <Text style={styles.footerText}>
          Sistema de gestión de estudiantes
        </Text>

      </View>

      {/* MODAL DE CONFIRMACIÓN, ÉXITO Y ERROR */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>

          <View style={styles.modalContainer}>

            {/* ICONO SEGÚN EL ESTADO */}
            <View
              style={[
                styles.modalIconContainer,
                modalType === 'confirm' && styles.warningIconContainer,
                modalType === 'success' && styles.successIconContainer,
                modalType === 'error' && styles.errorIconContainer,
              ]}
            >
              <Text style={styles.modalIcon}>
                {modalType === 'confirm'
                  ? '!'
                  : modalType === 'success'
                    ? '✓'
                    : '✕'}
              </Text>
            </View>

            {/* TÍTULO */}
            <Text style={styles.modalTitle}>
              {modalType === 'confirm'
                ? 'Eliminar estudiante'
                : modalType === 'success'
                  ? 'Operación completada'
                  : 'No se pudo completar'}
            </Text>

            {/* MENSAJE */}
            <Text style={styles.modalMessage}>
              {modalMessage}
            </Text>

            {/* BOTONES */}
            {modalType === 'confirm' ? (

              <View style={styles.modalButtons}>

                <Pressable
                  style={({ pressed }) => [
                    styles.modalButton,
                    styles.cancelButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={closeModal}
                  disabled={deleting}
                >
                  <Text style={styles.cancelButtonText}>
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
    backgroundColor: '#F1F5F9',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#172554',
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },

  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerIconText: {
    fontSize: 27,
  },

  headerDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
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
    backgroundColor: '#EFF6FF',
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
    color: '#172554',
    fontWeight: '800',
  },

  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },

  // ACTUALIZAR
  refreshButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
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
    color: '#2563EB',
    fontWeight: '700',
  },

  refreshButtonText: {
    color: '#1D4ED8',
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
    color: '#94A3B8',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  warningIconContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  successIconContainer: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },

  errorIconContainer: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },

  modalIcon: {
    fontSize: 27,
    fontWeight: '800',
    color: '#DC2626',
  },

  // TEXTOS DEL MODAL
  modalTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#172554',
    marginBottom: 10,
    textAlign: 'center',
  },

  modalMessage: {
    fontSize: 14,
    color: '#64748B',
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
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  cancelButtonText: {
    color: '#475569',
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
    backgroundColor: '#2563EB',
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
