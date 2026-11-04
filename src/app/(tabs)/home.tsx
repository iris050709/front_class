
/**
 * Pantalla de inicio (Home).
 * Muestra bienvenida y accesos rápidos según el tipo de usuario.
 * Compatible con Web, Android e iOS.
 */

import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from '../../store/store';

export default function HomeScreen() {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const router = useRouter();

  const isAdmin = user?.kind === 'user';
  const isStudent = user?.kind === 'student';

  const fullName =
    `${user?.nombre || ''} ${user?.apellido || ''}`.trim();

  const displayName = fullName || user?.email || 'Usuario';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>

        {/* ENCABEZADO DE BIENVENIDA */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTop}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeEyebrow}>
                {isAdmin ? 'PANEL DE ADMINISTRACIÓN' : 'PORTAL DEL ESTUDIANTE'}
              </Text>

              <Text style={styles.welcomeTitle}>
                ¡Bienvenido, {displayName}!
              </Text>

              <Text style={styles.welcomeName}>
                {displayName}
              </Text>

              {user?.email && (
                <Text style={styles.welcomeEmail}>
                  {user.email}
                </Text>
              )}
            </View>

            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>
                {isAdmin ? '👨‍💼' : '🎓'}
              </Text>
            </View>
          </View>

          <View style={styles.welcomeDivider} />

          <Text style={styles.welcomeMessage}>
            {isAdmin
              ? 'Gestiona los estudiantes y administra las cuentas desde un solo lugar.'
              : 'Consulta tu información personal y mantén tus datos actualizados.'}
          </Text>
        </View>

        {/* ACCIONES RÁPIDAS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>
                ACCESOS DIRECTOS
              </Text>

              <Text style={styles.sectionTitle}>
                Acciones rápidas
              </Text>

              <Text style={styles.sectionSubtitle}>
                Selecciona lo que deseas realizar.
              </Text>
            </View>
          </View>

          {/* OPCIONES DEL ADMINISTRADOR */}
          {isAdmin && (
            <>
              <Pressable
                style={({ pressed }) => [
                  styles.actionCard,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => router.push('/(tabs)/students')}
              >
                <View style={[styles.actionIconContainer, styles.blueIcon]}>
                  <Text style={styles.actionIcon}>📚</Text>
                </View>

                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>
                    Ver estudiantes
                  </Text>

                  <Text style={styles.actionDescription}>
                    Consulta y administra los estudiantes registrados.
                  </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionCard,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => router.push('/student/create')}
              >
                <View style={[styles.actionIconContainer, styles.greenIcon]}>
                  <Text style={styles.actionIcon}>➕</Text>
                </View>

                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>
                    Agregar estudiante
                  </Text>

                  <Text style={styles.actionDescription}>
                    Registra un nuevo estudiante en el sistema.
                  </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionCard,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => router.push('/user/create')}
              >
                <View style={[styles.actionIconContainer, styles.purpleIcon]}>
                  <Text style={styles.actionIcon}>👤</Text>
                </View>

                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>
                    Agregar usuario
                  </Text>

                  <Text style={styles.actionDescription}>
                    Registra una nueva cuenta de administrador.
                  </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
              </Pressable>
            </>
          )}

          {/* OPCIÓN DEL ESTUDIANTE */}
          {isStudent && (
            <Pressable
              style={({ pressed }) => [
                styles.actionCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <View style={[styles.actionIconContainer, styles.blueIcon]}>
                <Text style={styles.actionIcon}>👤</Text>
              </View>

              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>
                  Mi perfil
                </Text>

                <Text style={styles.actionDescription}>
                  Consulta y actualiza tu información personal.
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </Pressable>
          )}
        </View>

        {/* PIE DE PÁGINA */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Sistema de gestión de estudiantes
          </Text>

          <Text style={styles.footerSubtext}>
            Plataforma académica
          </Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // CONTENEDOR PRINCIPAL
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 35,
  },

  // BIENVENIDA
  welcomeCard: {
    backgroundColor: '#172554',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  welcomeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  welcomeTextContainer: {
    flex: 1,
  },

  welcomeEyebrow: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '800',
    marginBottom: 5,
  },

  welcomeName: {
    color: '#DBEAFE',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 5,
  },

  welcomeEmail: {
    color: '#BFDBFE',
    fontSize: 12,
  },

  avatarContainer: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    fontSize: 36,
  },

  welcomeDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginVertical: 19,
  },

  welcomeMessage: {
    color: '#BFDBFE',
    fontSize: 13,
    lineHeight: 21,
  },

  // SECCIÓN DE ACCIONES
  section: {
    marginBottom: 25,
  },

  sectionHeader: {
    marginBottom: 18,
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
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 5,
  },

  sectionSubtitle: {
    color: '#64748B',
    fontSize: 13,
  },

  // TARJETAS DE ACCIONES
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 17,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },

  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  blueIcon: {
    backgroundColor: '#EFF6FF',
  },

  greenIcon: {
    backgroundColor: '#ECFDF5',
  },

  purpleIcon: {
    backgroundColor: '#F5F3FF',
  },

  actionIcon: {
    fontSize: 25,
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
  },

  actionDescription: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
  },

  arrow: {
    color: '#94A3B8',
    fontSize: 29,
    fontWeight: '300',
    marginLeft: 8,
  },

  // PIE DE PÁGINA
  footer: {
    alignItems: 'center',
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  footerText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
  },

  footerSubtext: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 5,
  },
});
