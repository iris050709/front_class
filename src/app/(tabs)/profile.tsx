
/**
 * Pantalla de perfil del usuario.
 * Muestra información de cuenta, acciones y cierre de sesión.
 * Compatible con Web, Android e iOS.
 */

import { useState } from 'react';

import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Loading } from '../../components';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const { user, loading, logout, isAuthenticated } = useAuth();

  // Estados del modal.
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'info' | 'confirm'>('info');
  const [loggingOut, setLoggingOut] = useState(false);

  // Mostrar información en un modal.
  const showInfo = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType('info');
    setModalVisible(true);
  };

  // Mostrar indicador mientras se verifica la autenticación.
  if (loading) {
    return <Loading message="Cargando perfil..." />;
  }

  // Si no hay sesión activa.
  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.noSessionCard}>
          <Text style={styles.noSessionIcon}>🔒</Text>
          <Text style={styles.noSessionTitle}>
            Sesión no disponible
          </Text>
          <Text style={styles.noSessionText}>
            No hay una sesión activa. Inicia sesión para consultar tu perfil.
          </Text>
        </View>
      </View>
    );
  }

  // Datos del usuario.
  const email = user.email ?? '';
  const fullName =
    `${user.nombre ?? ''} ${user.apellido ?? ''}`.trim();

  const displayName = fullName || email || 'Usuario';
  const firstLetter = displayName.charAt(0).toUpperCase() || 'U';

  // Acciones del menú.
  const handleSettings = () => {
    showInfo(
      'Configuración',
      'La configuración de tu cuenta estará disponible próximamente.'
    );
  };

  const handleNotifications = () => {
    showInfo(
      'Notificaciones',
      'La administración de notificaciones estará disponible próximamente.'
    );
  };

  const handleHelp = () => {
    showInfo(
      'Ayuda',
      'La sección de ayuda estará disponible próximamente.'
    );
  };

  // Solicitar confirmación para cerrar sesión.
  const handleLogout = () => {
    setModalTitle('Cerrar sesión');
    setModalMessage(
      '¿Estás seguro de que deseas cerrar tu sesión?'
    );
    setModalType('confirm');
    setModalVisible(true);
  };

  // Ejecutar cierre de sesión.
  const confirmLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      setModalVisible(false);
      await logout();
    } catch (error) {
      showInfo(
        'Error',
        'No fue posible cerrar la sesión. Inténtalo nuevamente.'
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContent}>

          {/* ENCABEZADO DEL PERFIL */}
          <View style={styles.profileCard}>
            <View style={styles.profileTop}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>
                  {firstLetter}
                </Text>
              </View>

              <View style={styles.profileText}>
                <Text style={styles.profileEyebrow}>
                  MI CUENTA
                </Text>

                <Text style={styles.profileName}>
                  {displayName}
                </Text>

                <Text style={styles.profileEmail}>
                  {email || 'Correo no disponible'}
                </Text>
              </View>
            </View>

            <View style={styles.profileDivider} />

            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>
                Cuenta activa
              </Text>
            </View>
          </View>

          {/* INFORMACIÓN DE CUENTA */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>
                DATOS PERSONALES
              </Text>

              <Text style={styles.sectionTitle}>
                Información de cuenta
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>🆔</Text>
                </View>

                <View style={styles.infoContent}>
                  <Text style={styles.label}>
                    ID de usuario
                  </Text>

                  <Text style={styles.value}>
                    {user.id ?? 'No disponible'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>✉️</Text>
                </View>

                <View style={styles.infoContent}>
                  <Text style={styles.label}>
                    Correo electrónico
                  </Text>

                  <Text style={styles.value}>
                    {email || 'No disponible'}
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Text style={styles.infoIcon}>🛡️</Text>
                </View>

                <View style={styles.infoContent}>
                  <Text style={styles.label}>
                    Estado de cuenta
                  </Text>

                  <Text style={[styles.value, styles.activeStatus]}>
                    Activo
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ACCIONES */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>
                PREFERENCIAS
              </Text>

              <Text style={styles.sectionTitle}>
                Acciones
              </Text>

              <Text style={styles.sectionSubtitle}>
                Administra las opciones de tu cuenta.
              </Text>
            </View>

            {/* CONFIGURACIÓN */}
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={handleSettings}
            >
              <View style={[styles.menuIconContainer, styles.blueIcon]}>
                <Text style={styles.menuIcon}>⚙️</Text>
              </View>

              <View style={styles.menuContent}>
                <Text style={styles.menuText}>
                  Configuración
                </Text>

                <Text style={styles.menuDescription}>
                  Opciones generales de tu cuenta.
                </Text>
              </View>

              <Text style={styles.menuArrow}>›</Text>
            </Pressable>

            {/* NOTIFICACIONES */}
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={handleNotifications}
            >
              <View style={[styles.menuIconContainer, styles.orangeIcon]}>
                <Text style={styles.menuIcon}>🔔</Text>
              </View>

              <View style={styles.menuContent}>
                <Text style={styles.menuText}>
                  Notificaciones
                </Text>

                <Text style={styles.menuDescription}>
                  Preferencias de notificaciones.
                </Text>
              </View>

              <Text style={styles.menuArrow}>›</Text>
            </Pressable>

            {/* AYUDA */}
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={handleHelp}
            >
              <View style={[styles.menuIconContainer, styles.purpleIcon]}>
                <Text style={styles.menuIcon}>❓</Text>
              </View>

              <View style={styles.menuContent}>
                <Text style={styles.menuText}>
                  Ayuda
                </Text>

                <Text style={styles.menuDescription}>
                  Información y asistencia.
                </Text>
              </View>

              <Text style={styles.menuArrow}>›</Text>
            </Pressable>
          </View>

          {/* CERRAR SESIÓN */}
          <View style={styles.logoutSection}>
            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.logoutButtonPressed,
                loggingOut && styles.logoutButtonDisabled,
              ]}
              onPress={handleLogout}
              disabled={loggingOut}
            >
              <Text style={styles.logoutIcon}>↪</Text>

              <Text style={styles.logoutText}>
                {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
              </Text>
            </Pressable>

            <Text style={styles.footerText}>
              Sistema de gestión de estudiantes
            </Text>
          </View>

        </View>
      </ScrollView>

      {/* MODAL PERSONALIZADO */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!loggingOut) {
            setModalVisible(false);
          }
        }}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            <View
              style={[
                styles.modalIconContainer,
                modalType === 'confirm'
                  ? styles.modalWarning
                  : styles.modalInformation,
              ]}
            >
              <Text style={styles.modalIcon}>
                {modalType === 'confirm' ? '⚠️' : 'ℹ️'}
              </Text>
            </View>

            <Text style={styles.modalTitle}>
              {modalTitle}
            </Text>

            <Text style={styles.modalMessage}>
              {modalMessage}
            </Text>

            {modalType === 'confirm' ? (
              <View style={styles.modalButtons}>
                <Pressable
                  style={({ pressed }) => [
                    styles.cancelButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => setModalVisible(false)}
                  disabled={loggingOut}
                >
                  <Text style={styles.cancelButtonText}>
                    Cancelar
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.confirmButton,
                    pressed && styles.buttonPressed,
                    loggingOut && styles.confirmButtonDisabled,
                  ]}
                  onPress={confirmLogout}
                  disabled={loggingOut}
                >
                  <Text style={styles.confirmButtonText}>
                    {loggingOut ? 'Cerrando...' : 'Cerrar sesión'}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.okButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.okButtonText}>
                  Entendido
                </Text>
              </Pressable>
            )}

          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // CONTENEDOR PRINCIPAL
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 35,
  },

  innerContent: {
    width: '100%',
    maxWidth: 850,
    alignSelf: 'center',
  },

  // PERFIL
  profileCard: {
    backgroundColor: '#172554',
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 17,
  },

  avatarContainer: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },

  profileText: {
    flex: 1,
  },

  profileEyebrow: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  profileName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 5,
  },

  profileEmail: {
    color: '#BFDBFE',
    fontSize: 12,
  },

  profileDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginVertical: 19,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },

  statusText: {
    color: '#DBEAFE',
    fontSize: 12,
    fontWeight: '600',
  },

  // SECCIONES
  section: {
    marginBottom: 27,
  },

  sectionHeader: {
    marginBottom: 15,
  },

  sectionEyebrow: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 6,
  },

  sectionTitle: {
    color: '#172554',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 5,
  },

  sectionSubtitle: {
    color: '#64748B',
    fontSize: 13,
  },

  // INFORMACIÓN DE CUENTA
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 13,
  },

  infoIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoIcon: {
    fontSize: 19,
  },

  infoContent: {
    flex: 1,
  },

  label: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 5,
  },

  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },

  activeStatus: {
    color: '#16A34A',
  },

  infoDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },

  // MENÚ
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },

  menuItemPressed: {
    opacity: 0.75,
  },

  menuIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  blueIcon: {
    backgroundColor: '#EFF6FF',
  },

  orangeIcon: {
    backgroundColor: '#FFF7ED',
  },

  purpleIcon: {
    backgroundColor: '#F5F3FF',
  },

  menuIcon: {
    fontSize: 22,
  },

  menuContent: {
    flex: 1,
  },

  menuText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },

  menuDescription: {
    fontSize: 11,
    color: '#64748B',
  },

  menuArrow: {
    fontSize: 27,
    color: '#94A3B8',
    marginLeft: 8,
  },

  // CERRAR SESIÓN
  logoutSection: {
    marginTop: 5,
    alignItems: 'center',
  },

  logoutButton: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 13,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  logoutButtonPressed: {
    backgroundColor: '#FEE2E2',
    opacity: 0.8,
  },

  logoutButtonDisabled: {
    opacity: 0.6,
  },

  logoutIcon: {
    fontSize: 20,
    color: '#DC2626',
  },

  logoutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '800',
  },

  footerText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 20,
  },

  // SIN SESIÓN
  noSessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  noSessionIcon: {
    fontSize: 40,
    marginBottom: 15,
  },

  noSessionTitle: {
    color: '#1E293B',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
  },

  noSessionText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.55)',
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  modalIconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  modalWarning: {
    backgroundColor: '#FEF2F2',
  },

  modalInformation: {
    backgroundColor: '#EFF6FF',
  },

  modalIcon: {
    fontSize: 27,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },

  confirmButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },

  confirmButtonDisabled: {
    opacity: 0.6,
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  okButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },

  okButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  buttonPressed: {
    opacity: 0.75,
  },
});
