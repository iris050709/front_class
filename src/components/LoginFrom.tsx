
import { useState } from "react";

import {
    Button,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

import { LoginFormProps } from "../interfaces/auth.interface";

export default function LoginForm({
    onLogin,
    loading,
    error
}: LoginFormProps) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Errores individuales del formulario
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Mostrar u ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);

    // Limpiar error del correo al escribir
    const handleEmailChange = (text: string) => {
        setEmail(text);

        if (text.trim() !== "") {
            setEmailError("");
        }
    };

    // Limpiar error de contraseña al escribir
    const handlePasswordChange = (text: string) => {
        setPassword(text);

        if (text.trim() !== "") {
            setPasswordError("");
        }
    };

    const handleLogin = () => {

        let valid = true;

        // Limpiar errores anteriores
        setEmailError("");
        setPasswordError("");

        // Validar correo vacío
        if (email.trim() === "") {
            setEmailError("El correo electrónico es obligatorio");
            valid = false;
        }

        // Validar contraseña vacía
        if (password.trim() === "") {
            setPasswordError("La contraseña es obligatoria");
            valid = false;
        }

        // Si hay errores, no continuar
        if (!valid) {
            return;
        }

        // Enviar datos al hook
        onLogin(email.trim(), password);
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Iniciar sesión
            </Text>

            {/* CORREO ELECTRÓNICO */}

            <Text style={styles.label}>
                Correo Electrónico
            </Text>

            <TextInput
                style={[
                    styles.input,
                    emailError !== ""
                        ? styles.inputError
                        : null
                ]}
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChangeText={handleEmailChange}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!loading}
            />

            {emailError !== "" && (
                <Text style={styles.error}>
                    {emailError}
                </Text>
            )}

            {/* CONTRASEÑA */}

            <Text style={styles.label}>
                Contraseña
            </Text>

            <View style={styles.passwordContainer}>

                <TextInput
                    style={[
                        styles.passwordInput,
                        passwordError !== ""
                            ? styles.inputError
                            : null
                    ]}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    editable={!loading}
                />

                <Pressable
                    onPress={() =>
                        setShowPassword(!showPassword)
                    }
                    style={styles.showButton}
                    disabled={loading}
                >
                    <Text>
                        {showPassword
                            ? "Ocultar"
                            : "Mostrar"}
                    </Text>
                </Pressable>

            </View>

            {passwordError !== "" && (
                <Text style={styles.error}>
                    {passwordError}
                </Text>
            )}

            {/* ERROR DE AUTENTICACIÓN */}

            {error !== "" && (
                <Text style={styles.error}>
                    {error}
                </Text>
            )}

            {/* BOTÓN */}

            <Button
                title={
                    loading
                        ? "Validando..."
                        : "Iniciar sesión"
                }
                onPress={handleLogin}
                disabled={loading}
            />

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

    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 5,
    },

    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginBottom: 5,
    },

    passwordInput: {
        flex: 1,
        padding: 12,
    },

    showButton: {
        padding: 10,
    },

    inputError: {
        borderColor: "red",
    },

    error: {
        color: "red",
        marginBottom: 15,
    },
});
