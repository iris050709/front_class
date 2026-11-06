
/**
 * Context para sistema de notificaciones toast
 */

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

const DEFAULT_DURATION = 3000;
const MAX_NOTIFICATIONS = 5;

type Timer = ReturnType<typeof setTimeout>;

export function NotificationProvider({
  children,
  maxNotifications = MAX_NOTIFICATIONS,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const timersRef = useRef<Map<string, Timer>>(new Map());
  const notificationsRef = useRef<Notification[]>([]);

  const limit = Math.max(1, Math.floor(maxNotifications));

  // Actualizar notificaciones manteniendo una referencia actual
  const updateNotifications = useCallback(
    (updater: (prev: Notification[]) => Notification[]) => {
      const updated = updater(notificationsRef.current);

      notificationsRef.current = updated;
      setNotifications(updated);
    },
    []
  );

  // Cancelar temporizador de una notificación
  const clearTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);

    if (timer !== undefined) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  // Eliminar una notificación
  const dismiss = useCallback((id: string) => {
    clearTimer(id);

    updateNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  }, [clearTimer, updateNotifications]);

  // Vaciar todas las notificaciones
  const dismissAll = useCallback(() => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();

    updateNotifications(() => []);
  }, [updateNotifications]);

  // Generar identificador
  const generateId = () => {
    return Date.now().toString(36) +
      Math.random().toString(36).slice(2);
  };

  // Mostrar notificación
  const show = useCallback((
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = generateId();
    const notificationDuration = duration ?? DEFAULT_DURATION;

    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration: notificationDuration,
    };

    const previous = notificationsRef.current;
    const updated = [...previous, notification];

    // Identificar notificaciones que exceden el límite
    const removed = updated.slice(
      0,
      Math.max(0, updated.length - limit)
    );

    // Cancelar sus temporizadores
    removed.forEach(item => clearTimer(item.id));

    // Mantener únicamente las más recientes
    updateNotifications(() => updated.slice(-limit));

    // Configurar desaparición automática
    if (notificationDuration > 0) {
      const timer = setTimeout(() => {
        dismiss(id);
      }, notificationDuration);

      timersRef.current.set(id, timer);
    }
  }, [limit, clearTimer, updateNotifications, dismiss]);

  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      show('success', title, message, duration);
    },
    [show]
  );

  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      show('error', title, message, duration);
    },
    [show]
  );

  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      show('warning', title, message, duration);
    },
    [show]
  );

  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      show('info', title, message, duration);
    },
    [show]
  );

  // Limpiar temporizadores al desmontar el Provider
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current.clear();
      notificationsRef.current = [];
    };
  }, []);

  const value = useMemo<NotificationContextType>(() => ({
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismiss,
    dismissAll,
  }), [
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismiss,
    dismissAll,
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }

  return context;
}
