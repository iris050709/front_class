
/**
 * Lista de estudiantes.
 * Diseño compacto y compatible con tema claro y oscuro.
 */

import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { Student } from '../types/student';

import SearchBar from './SearchBar';
import StudentCard from './StudentCard';

interface StudentListProps {
  students: Student[];
  onStudentPress: (student: Student) => void;
  onDeleteStudent?: (id: number) => void;
}

export default function StudentList({
  students,
  onStudentPress,
  onDeleteStudent,
}: StudentListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return students;

    return students.filter((student) => {
      const fullName =
        `${student.nombre ?? ''} ${student.apellido ?? ''}`.toLowerCase();

      const matricula = String(student.matricula ?? '').toLowerCase();

      const email = String(student.email ?? '').toLowerCase();

      return (
        fullName.includes(query) ||
        matricula.includes(query) ||
        email.includes(query)
      );
    });
  }, [students, searchQuery]);

  const ListHeader = (
    <View style={styles.listHeader}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Buscar estudiante..."
          debounceMs={300}
        />
      </View>

      <View style={styles.resultsHeader}>
        <View>
          <Text style={[styles.resultsTitle, { color: colors.text }]}>
            {searchQuery.trim() ? 'Resultados' : 'Lista de estudiantes'}
          </Text>

          <Text
            style={[
              styles.resultsSubtitle,
              { color: colors.secondary },
            ]}
          >
            {filteredStudents.length === 1
              ? '1 estudiante encontrado'
              : `${filteredStudents.length} estudiantes encontrados`}
          </Text>
        </View>

        {searchQuery.trim() !== '' && (
          <Pressable
            onPress={() => setSearchQuery('')}
            style={[
              styles.clearButton,
              {
                backgroundColor: `${colors.primary}15`,
              },
            ]}
          >
            <Text
              style={[
                styles.clearButtonText,
                { color: colors.primary },
              ]}
            >
              Limpiar
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <FlatList
        data={filteredStudents}
        renderItem={({ item }) => (
          <View
            style={[
              styles.studentContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <StudentCard
              student={item}
              onPress={onStudentPress}
            />

            {onDeleteStudent && (
              <View
                style={[
                  styles.cardFooter,
                  {
                    borderTopColor: colors.border,
                    backgroundColor: colors.card,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.actionLabel,
                    { color: colors.secondary },
                  ]}
                >
                  ACCIONES
                </Text>

                <Pressable
                  onPress={() => onDeleteStudent(item.id)}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    {
                      backgroundColor: `${colors.error}12`,
                      borderColor: `${colors.error}45`,
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>

                  <Text
                    style={[
                      styles.deleteText,
                      { color: colors.error },
                    ]}
                  >
                    Eliminar
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View
            style={[
              styles.emptyContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.emptyIconContainer,
                {
                  backgroundColor: `${colors.primary}15`,
                },
              ]}
            >
              <Text style={styles.emptyIcon}>
                {searchQuery.trim() ? '🔎' : '🎓'}
              </Text>
            </View>

            <Text
              style={[
                styles.emptyTitle,
                { color: colors.text },
              ]}
            >
              {searchQuery.trim()
                ? 'No se encontraron resultados'
                : 'No hay estudiantes registrados'}
            </Text>

            <Text
              style={[
                styles.emptyMessage,
                { color: colors.secondary },
              ]}
            >
              {searchQuery.trim()
                ? 'Prueba con otro nombre, apellido, matrícula o correo electrónico.'
                : 'Los estudiantes registrados aparecerán aquí.'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
  },

  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  listHeader: {
    paddingBottom: 8,
  },

  searchContainer: {
    paddingHorizontal: 2,
    paddingTop: 4,
    paddingBottom: 16,
  },

  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    paddingBottom: 14,
  },

  resultsTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  resultsSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },

  clearButton: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 8,
  },

  clearButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },

  studentContainer: {
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  studentCard: {
    padding: 0,
  },

  pressed: {
    opacity: 0.75,
  },

  cardFooter: {
    minHeight: 48,
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  actionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  deleteIcon: {
    fontSize: 12,
  },

  deleteText: {
    fontSize: 12,
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 35,
    borderRadius: 14,
    borderWidth: 1,
  },

  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  emptyIcon: {
    fontSize: 26,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  emptyMessage: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 7,
  },
});
