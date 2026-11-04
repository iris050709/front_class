
/**
 * Pantalla de lista de estudiantes.
 * Compatible con Web, Android e iOS.
 * Solamente permite el acceso a usuarios de tipo "user".
 */

import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { ErrorMessage, Loading } from "../components";
import StudentList from "../components/StudentList";
import { useStudents } from "../hooks/useStudents";
import { studentService } from "../services/studentService";
import { RootState } from "../store/store";

export default function StudentsScreen() {
  const router = useRouter();

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const { students, loading, error, refresh } = useStudents();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"confirm" | "error" | "success">(
    "confirm"
  );

  // Bloquear el acceso de estudiantes.
  useEffect(() => {
    if (user && user.kind !== "user") {
      router.replace("/(tabs)/profile");
    }
  }, [user, router]);

  const handleStudentPress = (student: { id: number }) => {
    if (user?.kind !== "user") {
      router.replace("/(tabs)/profile");
      return;
    }

    router.push(`/student/${student.id}`);
  };

  // Abrir modal de confirmación.
  const handleDeleteStudent = (id: number) => {
    if (user?.kind !== "user") {
      return;
    }

    setSelectedStudentId(id);
    setModalType("confirm");
    setModalMessage("¿Estás seguro de que deseas eliminar este estudiante?");
    setModalVisible(true);
  };

  // Confirmar eliminación.
  const confirmDelete = async () => {
    if (selectedStudentId === null || user?.kind !== "user") {
      console.log("No se puede eliminar:", {
        selectedStudentId,
        userKind: user?.kind,
      });
      return;
    }

    setDeleting(true);

    try {
      console.log("Intentando eliminar estudiante:", selectedStudentId);

      await studentService.delete(selectedStudentId);

      console.log("Estudiante eliminado correctamente");

      setModalType("success");
      setModalMessage("El estudiante se eliminó correctamente.");

      await refresh();
    } catch (error: any) {
      console.error("ERROR AL ELIMINAR ESTUDIANTE:", error);
      console.error("Respuesta del servidor:", error?.response?.data);
      console.error("Código HTTP:", error?.response?.status);

      setModalType("error");
      setModalMessage(
        error?.response?.data?.message ||
        "No se pudo eliminar el estudiante. Intenta nuevamente."
      );
    } finally {
      setDeleting(false);
      setSelectedStudentId(null);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  // Mientras se verifica el tipo de cuenta.
  if (!user) {
    return <Loading message="Verificando sesión..." />;
  }

  if (user.kind !== "user") {
    return <Loading message="Redirigiendo..." />;
  }

  if (loading && !refreshing) {
    return <Loading message="Cargando estudiantes..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refresh} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Estudiantes</Text>
          <Text style={styles.subtitle}>
            Administra la lista de estudiantes registrados.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.refreshButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onRefresh}
            disabled={refreshing}
          >
            <Text style={styles.refreshButtonText}>
              {refreshing ? "Actualizando..." : "↻ Actualizar"}
            </Text>
          </Pressable>
        </View>

        <StudentList
          students={students}
          onStudentPress={handleStudentPress}
          onDeleteStudent={handleDeleteStudent}
        />
      </ScrollView>

      {/* Modal compatible con Web y dispositivos móviles */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!deleting) {
            setModalVisible(false);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {modalType === "confirm"
                ? "Eliminar estudiante"
                : modalType === "success"
                  ? "Operación completada"
                  : "Error"}
            </Text>

            <Text style={styles.modalMessage}>
              {modalMessage}
            </Text>

            {modalType === "confirm" ? (
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                  disabled={deleting}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={confirmDelete}
                  disabled={deleting}
                >
                  <Text style={styles.deleteButtonText}>
                    {deleting ? "Eliminando..." : "Eliminar"}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={[styles.modalButton, styles.acceptButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.acceptButtonText}>Aceptar</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },

  refreshButton: {
    alignSelf: "flex-start",
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },

  refreshButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  buttonPressed: {
    opacity: 0.75,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    elevation: 8,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },

  modalMessage: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 24,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButton: {
    backgroundColor: "#E5E7EB",
  },

  cancelButtonText: {
    color: "#374151",
    fontWeight: "600",
  },

  deleteButton: {
    backgroundColor: "#DC2626",
  },

  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  acceptButton: {
    backgroundColor: "#2563EB",
    alignSelf: "flex-end",
  },

  acceptButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
