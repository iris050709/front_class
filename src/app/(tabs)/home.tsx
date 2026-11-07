
/**
 * Pantalla de inicio
 * Muestra opciones según el tipo de usuario.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';

type Action = {
  title: string;
  description: string;
  route: Href;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { itemCount } = useCart();

  // Obtener nombre completo.
  const fullName = `${user?.nombre ?? ''} ${user?.apellido ?? ''}`.trim();

  const displayName = fullName || user?.email || 'Usuario';

  // Identificar el tipo de cuenta.
  const isAdmin = user?.kind === 'user';
  const isStudent = user?.kind === 'student';

  // Acciones para administrador.
  const adminActions: Action[] = [
    {
      title: 'Ver estudiantes',
      description: 'Consultar y administrar estudiantes',
      route: '/(tabs)/students',
      color: '#3B82F6',
      icon: 'people',
    },
    {
      title: 'Agregar estudiante',
      description: 'Registrar un nuevo estudiante',
      route: '/student/create',
      color: '#10B981',
      icon: 'person-add',
    },
    {
      title: 'Agregar usuario',
      description: 'Crear una cuenta de usuario',
      route: '/user/create',
      color: '#8B5CF6',
      icon: 'person-circle',
    },
    {
      title: 'Mi perfil',
      description: 'Consultar mi información personal',
      route: '/(tabs)/profile',
      color: '#F59E0B',
      icon: 'person',
    },
    {
      title: 'Ajustes',
      description: 'Configurar la aplicación',
      route: '/(tabs)/settings',
      color: '#64748B',
      icon: 'settings',
    },
  ];

  // Acciones para estudiante.
  const studentActions: Action[] = [
    {
      title: 'Mi perfil',
      description: 'Consultar mi información personal',
      route: '/(tabs)/profile',
      color: '#10B981',
      icon: 'person',
    },
    {
      title: 'Ajustes',
      description: 'Configurar la aplicación',
      route: '/(tabs)/settings',
      color: '#8B5CF6',
      icon: 'settings',
    },
  ];

  const quickActions: Action[] = isAdmin
    ? adminActions
    : isStudent
      ? studentActions
      : [];

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>

        {/* BIENVENIDA */}
        <View
          style={[
            styles.welcomeCard,
            { backgroundColor: colors.card },
          ]}
        >
          <View style={styles.welcomeIcon}>
            <Ionicons
              name="person-circle-outline"
              size={48}
              color={colors.primary}
            />
          </View>

          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            ¡Bienvenido/a!
          </Text>

          <Text style={[styles.userName, { color: colors.text }]}>
            {displayName}
          </Text>

          <Text
            style={[
              styles.welcomeSubtitle,
              { color: colors.secondary },
            ]}
          >
            {isAdmin
              ? 'Panel de administración'
              : isStudent
                ? 'Espacio de estudiante'
                : 'Bienvenido a la aplicación'}
          </Text>
        </View>

        {/* ACCIONES RÁPIDAS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Acciones rápidas
        </Text>

        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.title}
            style={[
              styles.actionCard,
              { backgroundColor: colors.card },
            ]}
            onPress={() => router.push(action.route)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: action.color },
              ]}
            >
              <Ionicons
                name={action.icon}
                size={22}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.actionContent}>
              <Text
                style={[
                  styles.actionTitle,
                  { color: colors.text },
                ]}
              >
                {action.title}
              </Text>

              <Text
                style={[
                  styles.actionDescription,
                  { color: colors.secondary },
                ]}
              >
                {action.description}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.secondary}
            />
          </TouchableOpacity>
        ))}

        {/* CARRITO DE COMPRAS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Compras
        </Text>

        <TouchableOpacity
          style={[
            styles.actionCard,
            { backgroundColor: colors.card },
          ]}
          onPress={() => router.push('/cart-test')}
          activeOpacity={0.7}
        >
          <View style={styles.cartIconContainer}>
            <Ionicons
              name="cart-outline"
              size={24}
              color="#FFFFFF"
            />

            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {itemCount > 99 ? '99+' : itemCount}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.actionContent}>
            <Text
              style={[
                styles.actionTitle,
                { color: colors.text },
              ]}
            >
              Carrito de compras
            </Text>

            <Text
              style={[
                styles.actionDescription,
                { color: colors.secondary },
              ]}
            >
              {itemCount === 0
                ? 'No tienes productos agregados'
                : `${itemCount} producto(s) en tu carrito`}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.secondary}
          />
        </TouchableOpacity>

        {!user && (
          <Text style={[styles.loadingText, { color: colors.secondary }]}>
            Cargando información del usuario...
          </Text>
        )}

      </View>
    </ScrollView>
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
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    padding: 20,
  },

  welcomeCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 28,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  welcomeIcon: {
    marginBottom: 10,
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  userName: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },

  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  actionDescription: {
    fontSize: 13,
  },

  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  cartIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    position: 'relative',
  },

  cartBadge: {
    position: 'absolute',
    top: -7,
    right: -7,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
