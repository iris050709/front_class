
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
        await onLogin(email, password);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>
                Iniciar sesión
            </Text>

            <TextInput
                style={[
                    styles.input,
                    {
                        color: colors.text,
                        borderColor: colors.border,
                        backgroundColor: colors.card,
                    },
                ]}
                placeholder="Correo electrónico"
                placeholderTextColor={colors.secondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                editable={!loading}
            />

            <View style={[
                styles.passwordContainer,
                {
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                },
            ]}>
                <TextInput
                    style={[styles.passwordInput, { color: colors.text }]}
                    placeholder="Contraseña"
                    placeholderTextColor={colors.secondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                />

                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    style={styles.eyeButton}
                >
                    <Text style={{ color: colors.primary }}>
                        {showPassword ? "Ocultar" : "Mostrar"}
                    </Text>
                </TouchableOpacity>
            </View>

            {!!error && (
                <Text style={styles.error}>{error}</Text>
            )}

            <TouchableOpacity
                style={[
                    styles.loginButton,
                    { backgroundColor: colors.primary },
                    loading && styles.disabledButton,
                ]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.loginButtonText}>
                    {loading ? "Validando..." : "Iniciar sesión"}
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
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
    },
    passwordInput: {
        flex: 1,
        padding: 12,
    },
    eyeButton: {
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    loginButton: {
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    loginButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    disabledButton: {
        opacity: 0.5,
    },
    error: {
        color: "red",
        marginBottom: 15,
        textAlign: "center",
    },
});
