
/**
 * Pantalla de login
 */

import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import LoginForm from "../components/LoginForm";
import { useNotification } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";
import { useLogin } from "../hooks/useLogin";

export default function LoginScreen() {
  const router = useRouter();

  const { login, loading, error } = useLogin();
  const { showError, showSuccess } = useNotification();
  const { colors, theme, toggleTheme } = useTheme();

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);

    if (success) {
      showSuccess("Bienvenido", "Inicio de sesión exitoso");
      router.replace("/(tabs)/home");
    } else {
      showError(
        "Error",
        error || "No se pudo iniciar sesión. Verifica tus credenciales."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={[styles.logo, { backgroundColor: colors.primary }]}>
              <Text style={styles.logoText}>S</Text>
            </View>

            <Text style={[styles.brandName, { color: colors.text }]}>
              SISTEMA
            </Text>
          </View>

          <TouchableOpacity
            onPress={toggleTheme}
            style={[
              styles.themeButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={styles.themeIcon}>
              {theme === "light" ? "🌙" : "☀️"}
            </Text>
            <Text style={[styles.themeText, { color: colors.text }]}>
              {theme === "light" ? "Oscuro" : "Claro"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.welcome}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            ¡Bienvenido!
          </Text>

          <Text style={[styles.welcomeSubtitle, { color: colors.secondary }]}>
            Inicia sesión para continuar con tu cuenta.
          </Text>
        </View>

        <View
          style={[
            styles.formCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <LoginForm
            onLogin={handleLogin}
            loading={loading}
            error={error}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.secondary }]}>
            ¿Todavía no tienes una cuenta?
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/register")}
            style={styles.registerButton}
          >
            <Text style={[styles.registerText, { color: colors.primary }]}>
              Crear una cuenta
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.bottomText, { color: colors.secondary }]}>
          Sistema de gestión de alumnos
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 30,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 55,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "bold",
  },
  brandName: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  themeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  themeIcon: {
    fontSize: 16,
  },
  themeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  welcome: {
    marginBottom: 25,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 9,
  },
  welcomeSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  formCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  footer: {
    alignItems: "center",
    marginTop: 28,
    gap: 7,
  },
  footerText: {
    fontSize: 14,
  },
  registerButton: {
    padding: 5,
  },
  registerText: {
    fontSize: 15,
    fontWeight: "700",
  },
  bottomText: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 45,
  },
});
