
import apiClient from "@/api/client";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type ModalType = "success" | "error" | "warning" | "confirm";

interface ModalData {
  visible: boolean;
  type: ModalType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function CreateUserScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState<ModalData>({
    visible: false,
    type: "warning",
    title: "",
    message: "",
  });

  // Mostrar ventana personalizada.
  const showModal = (data: Omit<ModalData, "visible">) => {
    setModal({
      ...data,
      visible: true,
    });
  };

  // Cerrar ventana.
  const closeModal = () => {
    setModal((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  // Regresar a la pantalla anterior.
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/home");
    }
  };

  // Validar formulario.
  const validateForm = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail && !password && !confirmPassword) {
      showModal({
        type: "warning",
        title: "Formulario vacío",
        message: "Debes completar todos los campos para registrar un usuario.",
        confirmText: "Entendido",
      });
      return false;
    }

    if (!normalizedEmail) {
      showModal({
        type: "warning",
        title: "Correo requerido",
        message: "Ingresa el correo electrónico del nuevo usuario.",
        confirmText: "Entendido",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      showModal({
        type: "warning",
        title: "Correo inválido",
        message: "Ingresa un correo electrónico válido.",
        confirmText: "Entendido",
      });
      return false;
    }

    if (!password) {
      showModal({
        type: "warning",
        title: "Contraseña requerida",
        message: "Ingresa una contraseña.",
        confirmText: "Entendido",
      });
      return false;
    }

    if (password.length < 6) {
      showModal({
        type: "warning",
        title: "Contraseña inválida",
        message: "La contraseña debe tener al menos 6 caracteres.",
        confirmText: "Entendido",
      });
      return false;
    }

    if (!confirmPassword) {
      showModal({
        type: "warning",
        title: "Confirmación requerida",
        message: "Debes confirmar la contraseña.",
        confirmText: "Entendido",
      });
      return false;
    }

    if (password !== confirmPassword) {
      showModal({
        type: "warning",
        title: "Las contraseñas no coinciden",
        message: "Verifica que ambas contraseñas sean iguales.",
        confirmText: "Entendido",
      });
      return false;
    }

    return true;
  };

  // Crear usuario administrador.
  const handleCreateUser = async () => {
    if (loading || !validateForm()) return;

    const normalizedEmail = email.trim().toLowerCase();

    try {
      setLoading(true);

      await apiClient.post("/api/auth/users", {
        email: normalizedEmail,
        password,
      });

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);

      showModal({
        type: "success",
        title: "¡Usuario creado!",
        message: "La cuenta administradora se creó correctamente.",
        confirmText: "Aceptar",
        onConfirm: handleGoBack,
      });
    } catch (error: unknown) {
      const apiError = error as {
        response?: {
          data?: {
            error?: string;
            message?: string;
          };
        };
      };

      const message =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        "No se pudo crear el usuario. Verifica tu conexión e inténtalo nuevamente.";

      showModal({
        type: "error",
        title: "Error al crear usuario",
        message,
        confirmText: "Entendido",
      });
    } finally {
      setLoading(false);
    }
  };

  // Confirmación antes de registrar.
  const confirmCreateUser = () => {
    if (loading) return;

    if (!validateForm()) return;

    showModal({
      type: "confirm",
      title: "Confirmar registro",
      message: `¿Deseas crear una cuenta administradora para ${email.trim()}?`,
      confirmText: "Sí, crear",
      cancelText: "Cancelar",
      onConfirm: handleCreateUser,
    });
  };

  // Acción del botón principal del modal.
  const handleModalConfirm = () => {
    const action = modal.onConfirm;

    closeModal();

    if (action) {
      action();
    }
  };

  // Cancelar confirmación.
  const handleModalCancel = () => {
    const action = modal.onCancel;

    closeModal();

    if (action) {
      action();
    }
  };

  const getModalIcon = () => {
    switch (modal.type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "confirm":
        return "?";
      default:
        return "!";
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >

        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Agregar usuario</Text>
          <Text style={styles.subtitle}>
            Registra una nueva cuenta administradora.
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <Text style={styles.label}>Correo electrónico</Text>

          <TextInput
            style={styles.input}
            placeholder="usuario@correo.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          {/* Contraseña */}
          <Text style={styles.label}>Contraseña</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.showButton}
              onPress={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <Text style={styles.showButtonText}>
                {showPassword ? "Ocultar" : "Mostrar"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Confirmar contraseña */}
          <Text style={styles.label}>Confirmar contraseña</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Repite la contraseña"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.showButton}
              onPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              disabled={loading}
            >
              <Text style={styles.showButtonText}>
                {showConfirmPassword ? "Ocultar" : "Mostrar"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Información */}
          <View style={styles.info}>
            <Text style={styles.infoText}>
              Esta cuenta tendrá permisos de administrador y podrá gestionar
              estudiantes.
            </Text>
          </View>

          {/* Crear usuario */}
        <TouchableOpacity
        style={[
            styles.submitButton,
            loading && styles.disabledButton,
        ]}
        onPress={confirmCreateUser}
        disabled={loading}
        activeOpacity={0.8}
        >
        {loading ? (
            <ActivityIndicator color="#FFFFFF" />
        ) : (
            <Text style={styles.submitText}>
            Crear usuario
            </Text>
        )}
        </TouchableOpacity>

        {/* Cancelar */}
        <TouchableOpacity
        style={[
            styles.cancelFormButton,
            loading && styles.disabledButton,
        ]}
        onPress={handleGoBack}
        disabled={loading}
        activeOpacity={0.8}
        >
        <Text style={styles.cancelFormText}>
            Cancelar
        </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal multiplataforma */}
      <Modal
        visible={modal.visible}
        transparent
        animationType="fade"
        onRequestClose={modal.type === "confirm" ? handleModalCancel : closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalIcon,
                modal.type === "success" && styles.successIcon,
                modal.type === "error" && styles.errorIcon,
                modal.type === "warning" && styles.warningIcon,
                modal.type === "confirm" && styles.confirmIcon,
              ]}
            >
              <Text style={styles.modalIconText}>
                {getModalIcon()}
              </Text>
            </View>

            <Text style={styles.modalTitle}>
              {modal.title}
            </Text>

            <Text style={styles.modalMessage}>
              {modal.message}
            </Text>

            <View style={styles.modalButtons}>
              {modal.cancelText && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleModalCancel}
                >
                  <Text style={styles.cancelButtonText}>
                    {modal.cancelText}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.modalConfirmButton,
                  !modal.cancelText && styles.fullModalButton,
                  modal.type === "success" && styles.successButton,
                  modal.type === "error" && styles.errorButton,
                  modal.type === "warning" && styles.warningButton,
                ]}
                onPress={handleModalConfirm}
              >
                <Text style={styles.modalConfirmText}>
                  {modal.confirmText || "Aceptar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
  },

  backText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "600",
  },

  header: {
    marginTop: 30,
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#64748B",
  },

  form: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 16,
    gap: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginTop: 8,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },

  passwordContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1E293B",
  },

  showButton: {
    paddingHorizontal: 12,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  showButtonText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "600",
  },

  info: {
    backgroundColor: "#EFF6FF",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },

  infoText: {
    color: "#1D4ED8",
    fontSize: 13,
    lineHeight: 20,
  },

  submitButton: {
    height: 52,
    backgroundColor: "#2563EB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Estilos del modal.
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalContainer: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },

  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  successIcon: {
    backgroundColor: "#DCFCE7",
  },

  errorIcon: {
    backgroundColor: "#FEE2E2",
  },

  warningIcon: {
    backgroundColor: "#FEF3C7",
  },

  confirmIcon: {
    backgroundColor: "#DBEAFE",
  },

  modalIconText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1E293B",
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
  },

  modalButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
  },

  modalConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  fullModalButton: {
    flex: 1,
  },

  successButton: {
    backgroundColor: "#16A34A",
  },

  errorButton: {
    backgroundColor: "#DC2626",
  },

  warningButton: {
    backgroundColor: "#D97706",
  },

  modalConfirmText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  cancelFormButton: {
    height: 52,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    },

    cancelFormText: {
    color: "#64748B",
    fontSize: 16,
    fontWeight: "600",
    },
});
