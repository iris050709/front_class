
/**
 * Componente de tarjeta de estudiante.
 * Muestra la información básica de un estudiante.
 * Compatible con modo claro y oscuro.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Student } from '../types/student';

interface StudentCardProps {
  student: Student;
  onPress?: (student: Student) => void;
}

const StudentCard = React.memo(
  ({ student, onPress }: StudentCardProps) => {
    const { colors } = useTheme();

    const initials =
      `${student.nombre?.charAt(0) || '?'}${student.apellido?.charAt(0) || '?'}`;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={() => onPress?.(student)}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel={`Estudiante ${student.nombre || ''} ${student.apellido || ''}`}
        accessibilityHint="Toca para ver los detalles del estudiante"
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.info}>
            <Text style={[styles.name, { color: colors.text }]}>
              {student.nombre || 'Sin nombre'}{' '}
              {student.apellido || ''}
            </Text>

            <Text style={[styles.matricula, { color: colors.secondary }]}>
              Matrícula: {student.matricula || 'No disponible'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border },
          ]}
        />

        <View style={styles.footer}>
          <Text style={[styles.label, { color: colors.secondary }]}>
            Email:
          </Text>

          <Text
            style={[styles.email, { color: colors.primary }]}
            numberOfLines={1}
          >
            {student.email || 'No disponible'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
);

StudentCard.displayName = 'StudentCard';

export default StudentCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  matricula: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    marginRight: 6,
  },
  email: {
    fontSize: 14,
    flex: 1,
  },
});
