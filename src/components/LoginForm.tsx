
import { LoginFormProps } from "@/interfaces/auth.interface";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function LoginForm({
  onLogin,
  loading,
  error,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { colors } = useTheme();

  const handleLogin = async () => {
    await onLogin(email.trim(), password);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Iniciar sesión
      </Text>

      <Text style={[styles.description, { color: colors.secondary }]}>
        Ingresa tus datos para acceder.
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>
        Correo electrónico
      </Text>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="ejemplo@correo.com"
          placeholderTextColor={colors.secondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          editable={true}
          returnKeyType="next"
        />
      </View>

      <Text style={[styles.label, { color: colors.text }]}>
        Contraseña
      </Text>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor={colors.secondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          editable={true}
          returnKeyType="go"
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          <Text style={{ color: colors.primary, fontWeight: "600" }}>
            {showPassword ? "Ocultar" : "Mostrar"}
          </Text>
        </TouchableOpacity>
      </View>

      {!!error && (
        <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.loginButton,
          { backgroundColor: colors.primary },
          loading && styles.disabledButton,
        ]}
        onPress={handleLogin}
        disabled={loading || !email.trim() || !password}
      >
        <Text style={styles.loginButtonText}>
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 7,
  },
  description: {
    fontSize: 14,
    marginBottom: 28,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 9,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 11,
    minHeight: 53,
    marginBottom: 21,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 13,
  },
  eyeButton: {
    padding: 8,
  },
  errorContainer: {
    borderRadius: 9,
    padding: 10,
    marginBottom: 15,
  },
  errorText: {
    fontSize: 13,
    textAlign: "center",
  },
  loginButton: {
    minHeight: 52,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
