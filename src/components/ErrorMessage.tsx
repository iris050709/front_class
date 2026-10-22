import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ApiError, ErrorType } from '../types/errors';

interface ErrorMessageProps {
  error: ApiError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  onDismiss 
}) => {
  if (!error) return null;

  const getIcon = () => {
    switch (error.type) {
      case ErrorType.NETWORK_ERROR:
        return '🔌';
      case ErrorType.UNAUTHORIZED:
        return '🔐';
      case ErrorType.VALIDATION_ERROR:
        return '⚠️';
      case ErrorType.SERVER_ERROR:
        return '🖥️';
      default:
        return '❌';
    }
  };

  const canRetry = error.type === ErrorType.NETWORK_ERROR || 
                   error.type === ErrorType.TIMEOUT;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>{getIcon()}</Text>
        <Text style={styles.message}>{error.message}</Text>
      </View>
      
      <View style={styles.actions}>
        {canRetry && onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        )}
        
        {onDismiss && (
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissText}>Cerrar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  dismissButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dismissText: {
    color: '#666',
    fontSize: 14,
  },
});