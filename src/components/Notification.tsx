
/**
 * Componente de notificación toast
 * Adaptado al tema global (claro/oscuro).
 */

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';

interface NotificationProps {
  notification: {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  };
  onDismiss: (id: string) => void;
}

const typeColors = {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

const typeLabels = {
  success: '✓',
  error: '!',
  warning: '⚠',
  info: 'i',
};

export default function Notification({
  notification,
  onDismiss,
}: NotificationProps) {
  const { colors, theme } = useTheme();

  const accentColor = typeColors[notification.type];
  const isDark = theme === 'dark';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderLeftColor: accentColor,
          shadowColor: isDark ? '#000000' : '#64748B',
        },
      ]}
    >
      {/* Indicador del tipo de notificación */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: `${accentColor}20`,
          },
        ]}
      >
        <Text
          style={[
            styles.icon,
            { color: accentColor },
          ]}
        >
          {typeLabels[notification.type]}
        </Text>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          {notification.title}
        </Text>

        {notification.message && (
          <Text
            style={[
              styles.message,
              { color: colors.secondary },
            ]}
          >
            {notification.message}
          </Text>
        )}
      </View>

      {/* Botón para cerrar */}
      <TouchableOpacity
        onPress={() => onDismiss(notification.id)}
        style={styles.dismissButton}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Cerrar notificación"
      >
        <Text
          style={[
            styles.dismiss,
            { color: colors.secondary },
          ]}
        >
          ×
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
  },

  message: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 19,
  },

  dismissButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginLeft: 8,
  },

  dismiss: {
    fontSize: 24,
    fontWeight: '400',
  },
});
