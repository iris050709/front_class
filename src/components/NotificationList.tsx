
/**
 * Lista de notificaciones
 * Compatible con el tema claro y oscuro.
 */

import {
    SafeAreaView,
    StyleSheet,
} from 'react-native';

import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

import Notification from './Notification';

export default function NotificationList() {
  const { notifications, dismiss } = useNotification();
  const { theme } = useTheme();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <SafeAreaView
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          backgroundColor: 'transparent',
        },
      ]}
    >
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={dismiss}
        />
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
  },
});
