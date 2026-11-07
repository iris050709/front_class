/**
 * Pantalla de perfil de usuario
 */

import { useState } from 'react';

import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isDark = theme === 'dark';
  const isStudent = user?.kind === 'student';

  const displayName = user?.nombre
    ? `${user.nombre} ${user.apellido || ''}`.trim()
    : user?.email?.split('@')[0] || 'Usuario';

  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await logout();
    } finally {
      setLoggingOut(false);
      setLogoutModalVisible(false);
    }
  };

  const renderData = (
    label: string,
    value?: string | number | null
  ) => {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    return (
      <View style={[styles.dataItem, { borderBottomColor: colors.border }]}>
        <Text style={[styles.dataLabel, { color: colors.secondary }]}>
          {label}
        </Text>

        <Text style={[styles.dataValue, { color: colors.text }]}>
          {String(value)}
        </Text>
      </View>
    );
  };

  return (
    <>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          {/* Encabezado del perfil */}
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatarContainer,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.avatarText}>
                {initial}
              </Text>
            </View>

            <Text style={[styles.name, { color: colors.text }]}>
              {displayName}
            </Text>

            <Text style={[styles.email, { color: colors.secondary }]}>
              {user?.email || 'Sin correo registrado'}
            </Text>

            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: isDark ? '#1E3A5F' : '#DBEAFE',
                },
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  {
                    color: isDark ? '#93C5FD' : '#1D4ED8',
                  },
                ]}
              >
                {isStudent ? 'Estudiante' : 'Administrador'}
              </Text>
            </View>
          </View>

          {/* Información personal */}
          <View
            style={[
              styles.section,
              { backgroundColor: colors.card },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>👤</Text>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Información personal
              </Text>
            </View>

            {renderData('Nombre', user?.nombre)}
            {renderData('Apellido', user?.apellido)}

            {isStudent && (
              <>
                {renderData('Matrícula', user?.matricula)}
                {renderData('ID de usuario', user?.id)}
              </>
            )}

            {renderData('Correo electrónico', user?.email)}
            {renderData(
              'Tipo de cuenta',
              isStudent ? 'Estudiante' : 'Administrador'
            )}
          </View>

          {/* Preferencias */}
          <View
            style={[
              styles.section,
              { backgroundColor: colors.card },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⚙️</Text>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Preferencias
              </Text>
            </View>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={toggleTheme}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  Apariencia
                </Text>

                <Text
                  style={[
                    styles.settingDescription,
                    { color: colors.secondary },
                  ]}
                >
                  Cambia el tema de la aplicación
                </Text>
              </View>

              <View
                style={[
                  styles.themeBadge,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.settingValue, { color: colors.text }]}>
                  {isDark ? '🌙 Oscuro' : '☀️ Claro'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Botón cerrar sesión */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setLogoutModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutIcon}>↪</Text>

            <Text style={styles.logoutText}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>

          <Text style={[styles.footerText, { color: colors.secondary }]}>
            Sistema de administración de estudiantes
          </Text>
        </View>
      </ScrollView>

      {/* Modal de confirmación */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.card },
            ]}
          >
            {/* Icono */}
            <View
              style={[
                styles.modalIconContainer,
                {
                  backgroundColor: isDark ? '#44232A' : '#FEE2E2',
                },
              ]}
            >
              <Text
                style={[
                  styles.modalIcon,
                  { color: '#EF4444' },
                ]}
              >
                ↪
              </Text>
            </View>

            {/* Título */}
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              ¿Cerrar sesión?
            </Text>

            {/* Descripción */}
            <Text
              style={[
                styles.modalDescription,
                { color: colors.secondary },
              ]}
            >
              ¿Estás seguro de que deseas salir de tu cuenta?
              Tendrás que iniciar sesión nuevamente para acceder
              a la aplicación.
            </Text>

            {/* Acciones */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setLogoutModalVisible(false)}
                disabled={loggingOut}
                activeOpacity={0.7}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  { opacity: loggingOut ? 0.6 : 1 },
                ]}
                onPress={handleLogout}
                disabled={loggingOut}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>
                  {loggingOut ? 'Cerrando...' : 'Sí, cerrar sesión'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  profileHeader: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 25,
    marginBottom: 15,
  },
  avatarContainer: {
    width: 95,
    height: 95,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 23,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  email: {
    fontSize: 14,
    marginBottom: 14,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    width: '100%',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  dataItem: {
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dataLabel: {
    fontSize: 13,
    marginBottom: 5,
  },
  dataValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  themeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  settingValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  logoutButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    marginRight: 10,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 12,
    marginTop: 25,
    textAlign: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalIcon: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 25,
  },
  modalActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});