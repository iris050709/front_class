
/**
 * Pantalla de login
 */

import { useRouter } from "expo-router";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  const { colors } = useTheme();

  const handleLogin = async (
    email: string,
    password: string
  ) => {
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <LoginForm
          onLogin={handleLogin}
          loading={loading}
          error={error}
        />

        <TouchableOpacity
          onPress={() => router.push("/register")}
          style={styles.registerButton}
        >
          <Text
            style={[
              styles.registerText,
              { color: colors.primary },
            ]}
          >
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  registerButton: {
    marginTop: 20,
    padding: 10,
  },
  registerText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
