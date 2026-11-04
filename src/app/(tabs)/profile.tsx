
/**
 * Pantalla de perfil del usuario
 * Muestra información de cuenta, acciones y cierre de sesión.
 * Los modales funcionan en Web y dispositivos móviles.
 */

import { useState } from 'react';

import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Loading } from '../../components';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const { user, loading, logout, isAuthenticated } = useAuth();

  // Estados del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'info' | 'confirm'>('info');
  const [loggingOut, setLoggingOut] = useState(false);

  // Mostrar información en un modal
  const showInfo = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType('info');
    setModalVisible(true);
  };

  // Mostrar indicador mientras se verifica la autenticación
  if (loading) {
    return <Loading message="Cargando perfil..." />;
  }

  // Si no hay sesión activa
  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No hay sesión activa
        </Text>
      </View>
    );
  }

  // Datos del usuario
  const email = user.email ?? '';
  const firstLetter = email.charAt(0).toUpperCase() || 'U';

  // Acción: Configuración
  const handleSettings = () => {
    showInfo(
      'Configuración',
      'La configuración de tu cuenta estará disponible próximamente.'
    );
  };

  // Acción: Notificaciones
  const handleNotifications = () => {
    showInfo(
      'Notificaciones',
      'La administración de notificaciones estará disponible próximamente.'
    );
  };

  // Acción: Ayuda
  const handleHelp = () => {
    showInfo(
      'Ayuda',
      'La sección de ayuda estará disponible próximamente.'
    );
  };

  // Solicitar confirmación para cerrar sesión
  const handleLogout = () => {
    setModalTitle('Cerrar sesión');
    setModalMessage(
      '¿Estás seguro que deseas cerrar sesión?'
    );
    setModalType('confirm');
    setModalVisible(true);
  };

  // Ejecutar cierre de sesión
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
        {/* TARJETA DE PERFIL */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>
              {firstLetter}
            </Text>
          </View>

          <Text style={styles.title}>
            Mi Perfil
          </Text>

          <Text style={styles.email}>
            {email}
          </Text>
        </View>

        {/* INFORMACIÓN DE CUENTA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Información de cuenta
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              ID de usuario:
            </Text>

            <Text style={styles.value}>
              {user.id ?? 'No disponible'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Email:
            </Text>

            <Text style={styles.value}>
              {email || 'No disponible'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Estado:
            </Text>

            <Text style={[styles.value, styles.activeStatus]}>
              Activo
            </Text>
          </View>
        </View>

        {/* ACCIONES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Acciones
          </Text>

          {/* CONFIGURACIÓN */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleSettings}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>
              ⚙️
            </Text>

            <Text style={styles.menuText}>
              Configuración
            </Text>

            <Text style={styles.menuArrow}>
              ›
            </Text>
          </TouchableOpacity>

          {/* NOTIFICACIONES */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleNotifications}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>
              🔔
            </Text>

            <Text style={styles.menuText}>
              Notificaciones
            </Text>

            <Text style={styles.menuArrow}>
              ›
            </Text>
          </TouchableOpacity>

          {/* AYUDA */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleHelp}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>
              ❓
            </Text>

            <Text style={styles.menuText}>
              Ayuda
            </Text>

            <Text style={styles.menuArrow}>
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* CERRAR SESIÓN */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            loggingOut && styles.logoutButtonDisabled,
          ]}
          onPress={handleLogout}
          activeOpacity={0.8}
          disabled={loggingOut}
        >
          <Text style={styles.logoutText}>
            {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL PERSONALIZADO */}
      <Modal
        visible={modalVisible}
        transparent={true}
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

            {/* TÍTULO */}
            <Text style={styles.modalTitle}>
              {modalTitle}
            </Text>

            {/* MENSAJE */}
            <Text style={styles.modalMessage}>
              {modalMessage}
            </Text>

            {/* BOTONES DE CONFIRMACIÓN */}
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

              /* BOTÓN PARA CERRAR INFORMACIÓN */
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

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  content: {
    padding: 20,
    flexGrow: 1,
  },

  // TARJETA DE PERFIL
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  avatarContainer: {
    marginBottom: 16,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    fontSize: 36,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 80,
    overflow: 'hidden',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },

  email: {
    fontSize: 16,
    color: '#6B7280',
  },

  // SECCIONES
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },

  // INFORMACIÓN
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  label: {
    fontSize: 14,
    color: '#6B7280',
  },

  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },

  activeStatus: {
    color: '#10B981',
  },

  // MENÚ DE ACCIONES
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  menuText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },

  menuArrow: {
    fontSize: 24,
    color: '#9CA3AF',
  },

  // BOTÓN CERRAR SESIÓN
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 10,
  },

  logoutButtonDisabled: {
    opacity: 0.6,
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // MENSAJE SIN SESIÓN
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },

  modalMessage: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 24,
  },

  // BOTONES DEL MODAL
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 10,
  },

  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },

  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
  },

  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
  },

  confirmButtonDisabled: {
    opacity: 0.6,
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  okButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  okButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  buttonPressed: {
    opacity: 0.7,
  },
});
