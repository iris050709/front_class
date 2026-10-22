
import { useRouter } from "expo-router";
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import MenuItem from "../components/MenuItem";
import { RootState, logout } from "../store/store";
import { removeStorage } from "../utils/authStorage";

export default function ProfileScreen() {
    const router = useRouter();
    const dispatch = useDispatch();

    const user = useSelector(
        (state: RootState) => state.auth.user
    );

    const displayName = user?.nombre
        ? `${user.nombre} ${user.apellido || ""}`.trim()
        : user?.email
            ? user.email.split("@")[0]
            : "Alumno";

    const initial = displayName.charAt(0).toUpperCase();

    const handleGoBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/home");
        }
    };

    const handleLogout = async () => {
        try {
            await removeStorage("user_token");
            await removeStorage("user_info");

            dispatch(logout());
            router.replace("/");
        } catch {
            Alert.alert(
                "Error",
                "No se pudo cerrar la sesión correctamente."
            );
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#FFFFFF"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ENCABEZADO */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleGoBack}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.back}>‹</Text>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Mi Perfil
                    </Text>

                    <View style={styles.headerPlaceholder} />
                </View>

                {/* TARJETA DE PERFIL */}
                <View style={styles.profileCard}>
                    <View style={styles.profileDecoration} />

                    <View style={styles.avatarBorder}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {initial}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.name}>
                        {displayName}
                    </Text>

                    <Text style={styles.email}>
                        {user?.email || "Sin correo registrado"}
                    </Text>

                    {user?.matricula ? (
                        <View style={styles.matriculaBadge}>
                            <Text style={styles.matriculaIcon}>
                                🎓
                            </Text>
                            <Text style={styles.matricula}>
                                Matrícula: {user.matricula}
                            </Text>
                        </View>
                    ) : null}
                </View>

                {/* INFORMACIÓN PERSONAL */}
                <Text style={styles.sectionTitle}>
                    Información personal
                </Text>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Text style={styles.infoIcon}>👤</Text>
                        </View>

                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>
                                Nombre completo
                            </Text>
                            <Text style={styles.infoValue}>
                                {displayName}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoDivider} />

                    <View style={styles.infoRow}>
                        <View style={[styles.infoIconBox, styles.emailIconBox]}>
                            <Text style={styles.infoIcon}>✉️</Text>
                        </View>

                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>
                                Correo electrónico
                            </Text>
                            <Text style={styles.infoValue}>
                                {user?.email || "Sin correo"}
                            </Text>
                        </View>
                    </View>

                    {user?.matricula ? (
                        <>
                            <View style={styles.infoDivider} />

                            <View style={styles.infoRow}>
                                <View
                                    style={[
                                        styles.infoIconBox,
                                        styles.matriculaIconBox,
                                    ]}
                                >
                                    <Text style={styles.infoIcon}>
                                        🎓
                                    </Text>
                                </View>

                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>
                                        Matrícula
                                    </Text>
                                    <Text style={styles.infoValue}>
                                        {user.matricula}
                                    </Text>
                                </View>
                            </View>
                        </>
                    ) : null}
                </View>

                {/* NAVEGACIÓN */}
                <Text style={styles.sectionTitle}>
                    Navegación
                </Text>

                <View style={styles.options}>
                    <MenuItem
                        title="Inicio"
                        icon="🏠"
                        onPress={() => router.replace("/home")}
                    />

                    <MenuItem
                        title="Mi Perfil"
                        icon="👤"
                        onPress={() => {}}
                    />

                    <MenuItem
                        title="Configuración"
                        icon="⚙️"
                        onPress={() => router.push("/settings")}
                    />
                </View>

                {/* CERRAR SESIÓN */}
                <TouchableOpacity
                    style={styles.logout}
                    onPress={handleLogout}
                    activeOpacity={0.75}
                >
                    <View style={styles.logoutIconBox}>
                        <Text style={styles.logoutIcon}>
                            ↪
                        </Text>
                    </View>

                    <View style={styles.logoutInfo}>
                        <Text style={styles.logoutText}>
                            Cerrar sesión
                        </Text>
                        <Text style={styles.logoutSubtitle}>
                            Salir de tu cuenta de forma segura
                        </Text>
                    </View>

                    <Text style={styles.logoutArrow}>›</Text>
                </TouchableOpacity>

                <Text style={styles.footer}>
                    MI CUENTA · PERFIL DE USUARIO
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FB",
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 30,
    },

    // Encabezado
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28,
    },

    backButton: {
        width: 45,
        height: 45,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E1E7F0",
        alignItems: "center",
        justifyContent: "center",
    },

    back: {
        color: "#25334A",
        fontSize: 34,
        lineHeight: 38,
        marginTop: -4,
    },

    headerTitle: {
        color: "#17243A",
        fontSize: 22,
        fontWeight: "800",
    },

    headerPlaceholder: {
        width: 45,
    },

    // Tarjeta de perfil
    profileCard: {
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E4EAF3",
        borderRadius: 26,
        paddingHorizontal: 18,
        paddingTop: 28,
        paddingBottom: 25,
        marginBottom: 30,
        overflow: "hidden",
        elevation: 2,
        shadowColor: "#25334A",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },

    profileDecoration: {
        position: "absolute",
        top: -100,
        width: 240,
        height: 180,
        borderRadius: 120,
        backgroundColor: "#4B83E6",
        opacity: 0.10,
    },

    avatarBorder: {
        width: 112,
        height: 112,
        borderRadius: 56,
        borderWidth: 2,
        borderColor: "#76A5FF",
        padding: 5,
        marginBottom: 18,
    },

    avatar: {
        flex: 1,
        borderRadius: 50,
        backgroundColor: "#3978E8",
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        color: "#FFFFFF",
        fontSize: 43,
        fontWeight: "900",
    },

    name: {
        color: "#17243A",
        fontSize: 23,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 8,
    },

    email: {
        color: "#64748B",
        fontSize: 14,
        textAlign: "center",
    },

    matriculaBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EDF4FF",
        borderColor: "#D5E4FF",
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginTop: 18,
    },

    matriculaIcon: {
        fontSize: 15,
        marginRight: 8,
    },

    matricula: {
        color: "#2859A8",
        fontSize: 13,
        fontWeight: "700",
    },

    // Información personal
    sectionTitle: {
        color: "#17243A",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 15,
    },

    infoCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E4EAF3",
        borderRadius: 22,
        paddingHorizontal: 16,
        marginBottom: 30,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 17,
    },

    infoIconBox: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: "#EAF1FF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    emailIconBox: {
        backgroundColor: "#F0EBFF",
    },

    matriculaIconBox: {
        backgroundColor: "#E5F6EE",
    },

    infoIcon: {
        fontSize: 20,
    },

    infoTextContainer: {
        flex: 1,
    },

    infoLabel: {
        color: "#718096",
        fontSize: 12,
        marginBottom: 5,
    },

    infoValue: {
        color: "#263449",
        fontSize: 14,
        fontWeight: "700",
    },

    infoDivider: {
        height: 1,
        backgroundColor: "#E9EDF4",
    },

    // Opciones
    options: {
        gap: 12,
        marginBottom: 25,
    },

    // Cerrar sesión
    logout: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF1F2",
        borderWidth: 1,
        borderColor: "#FFD5DB",
        borderRadius: 20,
        padding: 16,
        marginTop: 5,
    },

    logoutIconBox: {
        width: 48,
        height: 48,
        borderRadius: 15,
        backgroundColor: "#FFE0E5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    logoutIcon: {
        color: "#E54861",
        fontSize: 29,
        fontWeight: "700",
    },

    logoutInfo: {
        flex: 1,
    },

    logoutText: {
        color: "#D93650",
        fontSize: 15,
        fontWeight: "800",
        marginBottom: 5,
    },

    logoutSubtitle: {
        color: "#9F6670",
        fontSize: 11,
    },

    logoutArrow: {
        color: "#D93650",
        fontSize: 29,
        marginLeft: 8,
    },

    footer: {
        color: "#94A0B2",
        fontSize: 10,
        textAlign: "center",
        letterSpacing: 1.5,
        fontWeight: "700",
        marginTop: 25,
    },
});
