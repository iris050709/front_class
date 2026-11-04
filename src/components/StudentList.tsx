
/**
 * Componente de lista de estudiantes.
 * Compatible con Web, Android e iOS.
 */

import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Student } from "../types/student";
import StudentCard from "./StudentCard";

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return students;

    return students.filter((student) =>
      `${student.nombre} ${student.apellido} ${student.matricula}`
        .toLowerCase()
        .includes(query)
    );
  }, [students, searchQuery]);

  const renderStudent = ({ item }: { item: Student }) => (
    <View style={styles.studentContainer}>
      <View style={styles.studentCard}>
        <StudentCard
          student={item}
          onPress={() => onStudentPress(item)}
        />
      </View>

      {onDeleteStudent && (
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
          ]}
          onPress={() => onDeleteStudent(item.id)}
        >
          <Text style={styles.deleteButtonText}>
            🗑 Eliminar
          </Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre, apellido o matrícula..."
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No se encontraron estudiantes
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  searchInput: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#1F2937",
  },

  listContent: {
    padding: 16,
    paddingBottom: 30,
  },

  studentContainer: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  studentCard: {
    flex: 1,
  },

  deleteButton: {
    backgroundColor: "#DC2626",
    padding: 12,
    alignItems: "center",
  },

  deleteButtonPressed: {
    opacity: 0.7,
  },

  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    marginTop: 40,
  },
});
