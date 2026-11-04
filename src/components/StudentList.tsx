
/**
 * Componente de lista de estudiantes.
 * Compatible con Web, Android e iOS.
 * Incluye búsqueda con debounce y eliminación de estudiantes.
 */

import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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

  // Filtrar estudiantes según la búsqueda.
  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const fullName =
        `${student.nombre} ${student.apellido}`.toLowerCase();

      const matricula = String(student.matricula).toLowerCase();

      return (
        fullName.includes(query) ||
        matricula.includes(query)
      );
    });
  }, [students, searchQuery]);

  // Memorizar el renderizado de cada estudiante.
  const renderStudent = useCallback(
    ({ item }: { item: Student }) => (
      <View style={styles.studentContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.studentCard,
            pressed && styles.cardPressed,
          ]}
          onPress={() => onStudentPress(item)}
        >
          <StudentCard
            student={item}
            onPress={() => onStudentPress(item)}
          />
        </Pressable>

        {onDeleteStudent && (
          <View style={styles.cardFooter}>
            <Text style={styles.footerLabel}>
              ACCIONES
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.deleteButtonPressed,
              ]}
              onPress={() => onDeleteStudent(item.id)}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>

              <Text style={styles.deleteButtonText}>
                Eliminar estudiante
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    ),
    [onStudentPress, onDeleteStudent]
  );

  // Encabezado integrado en el desplazamiento de FlatList.
  const ListHeader = useMemo(
    () => (
      <View>
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>
            DIRECTORIO ACADÉMICO
          </Text>

          <Text style={styles.headerTitle}>
            Estudiantes
          </Text>

          <Text style={styles.headerSubtitle}>
            Consulta y administra los estudiantes registrados.
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Buscar por nombre, apellido o matrícula..."
            debounceMs={300}
          />
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {searchQuery.trim()
              ? 'Resultados de búsqueda'
              : 'Directorio de estudiantes'}
          </Text>
        </View>
      </View>
    ),
    [searchQuery]
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={false}
        removeClippedSubviews={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={7}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>
                {searchQuery.trim() ? '🔎' : '🎓'}
              </Text>
            </View>

            <Text style={styles.emptyTitle}>
              {searchQuery.trim()
                ? 'Sin resultados'
                : 'No hay estudiantes'}
            </Text>

            <Text style={styles.emptyText}>
              {searchQuery.trim()
                ? 'No encontramos estudiantes que coincidan con tu búsqueda. Intenta con otro nombre o matrícula.'
                : 'Todavía no hay estudiantes registrados en el sistema.'}
            </Text>

            {searchQuery.trim() !== '' && (
              <Pressable
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
              >
                <Text style={styles.clearSearchText}>
                  Limpiar búsqueda
                </Text>
              </Pressable>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // CONTENEDOR PRINCIPAL
  container: {
    flex: 1,
    minHeight: 0,
    backgroundColor: '#F1F5F9',
  },

  flatList: {
    flex: 1,
  },

  listContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  // ENCABEZADO
  header: {
    backgroundColor: '#172554',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 26,
  },

  headerEyebrow: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 9,
  },

  headerTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 7,
  },

  headerSubtitle: {
    fontSize: 13,
    color: '#BFDBFE',
    lineHeight: 20,
  },

  // BUSCADOR
  searchContainer: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
  },

  // RESULTADOS
  resultsHeader: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 14,
  },

  resultsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },

  // TARJETAS
  studentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginHorizontal: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  studentCard: {
    backgroundColor: '#FFFFFF',
  },

  cardPressed: {
    opacity: 0.85,
  },

  // PIE DE TARJETA
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FAFBFD',
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  footerLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '800',
    letterSpacing: 1,
  },

  // BOTÓN ELIMINAR
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  deleteIcon: {
    fontSize: 13,
  },

  deleteButtonText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },

  deleteButtonPressed: {
    backgroundColor: '#FEE2E2',
    opacity: 0.8,
  },

  // ESTADO VACÍO
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 25,
    paddingVertical: 40,
    marginHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  emptyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 17,
  },

  emptyIcon: {
    fontSize: 29,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 320,
  },

  clearSearchButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 9,
    marginTop: 18,
  },

  clearSearchText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
});
