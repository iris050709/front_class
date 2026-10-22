
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import SideMenu from "../components/SideMenu";
import { RootState, logout } from "../store/store";
import { closeSession } from "../utils/logout";

export default function HomeScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);

    const user = useSelector(
        (state: RootState) => state.auth.user
    );

    const firstName = user?.nombre?.trim()
        ? user.nombre.trim().split(" ")[0]
        : user?.email
            ? user.email.split("@")[0]
            : "Usuario";

    
    const handleLogout = async () => {
        setMenuOpen(false);

        try {
            await closeSession();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            // Limpiar el estado de autenticación de Redux.
            dispatch(logout());

            // Volver a la pantalla de inicio de sesión.
            router.replace("/");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F5F8FC"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ENCABEZADO */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => setMenuOpen(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.menuIcon}>☰</Text>
                    </TouchableOpacity>

                    <View style={styles.headerText}>
                        <Text style={styles.headerGreeting}>
                            Hola, {firstName} 👋
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Qué bueno tenerte aquí
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.avatar}
                        onPress={() => router.push("/profile")}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.avatarText}>
                            {firstName.charAt(0).toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* BIENVENIDA */}
                <View style={styles.heroCard}>
                    <View style={styles.decorationOne} />
                    <View style={styles.decorationTwo} />

                    <View style={styles.badge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.badgeText}>
                            TU ESPACIO PERSONAL
                        </Text>
                    </View>

                    <Text style={styles.heroTitle}>
                        ¡Bienvenido/a!
                    </Text>

                    <Text style={styles.heroDescription}>
                        Administra tu cuenta y consulta tus
                        opciones desde un solo lugar.
                    </Text>
                </View>

                {/* OPCIONES */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Accesos rápidos
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                        Selecciona una opción
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.optionCard}
                    onPress={() => router.push("/profile")}
                    activeOpacity={0.75}
                >
                    <View style={[styles.optionIcon, styles.profileIcon]}>
                        <Text style={styles.emoji}>👤</Text>
                    </View>

                    <View style={styles.optionInfo}>
                        <Text style={styles.optionTitle}>
                            Mi perfil
                        </Text>
                        <Text style={styles.optionDescription}>
                            Consulta tus datos personales
                        </Text>
                    </View>

                    <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionCard}
                    onPress={() => router.push("/settings")}
                    activeOpacity={0.75}
                >
                    <View style={[styles.optionIcon, styles.settingsIcon]}>
                        <Text style={styles.emoji}>⚙️</Text>
                    </View>

                    <View style={styles.optionInfo}>
                        <Text style={styles.optionTitle}>
                            Configuración
                        </Text>
                        <Text style={styles.optionDescription}>
                            Administra las opciones de tu cuenta
                        </Text>
                    </View>

                    <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* MENÚ LATERAL */}
            <SideMenu
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}
                onProfile={() => {
                    setMenuOpen(false);
                    router.push("/profile");
                }}
                onSettings={() => {
                    setMenuOpen(false);
                    router.push("/settings");
                }}
                onLogout={handleLogout}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F8FC",
    },

    scrollContent: {
        paddingHorizontal: 22,
        paddingTop: 20,
        paddingBottom: 35,
    },

    // Encabezado
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 32,
        gap: 12,
    },

    menuButton: {
        width: 46,
        height: 46,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E1E8F0",
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
    },

    menuIcon: {
        color: "#263449",
        fontSize: 23,
    },

    headerText: {
        flex: 1,
    },

    headerGreeting: {
        color: "#172337",
        fontSize: 18,
        fontWeight: "800",
    },

    headerSubtitle: {
        color: "#7A8799",
        fontSize: 12,
        marginTop: 4,
    },

    avatar: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: "#48D6C2",
        borderWidth: 2,
        borderColor: "#B4F2E9",
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        color: "#123B3A",
        fontSize: 20,
        fontWeight: "900",
    },

    // Tarjeta de bienvenida
    heroCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 26,
        padding: 24,
        marginBottom: 34,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#DDE9EF",
        elevation: 3,
        shadowColor: "#31465A",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
    },

    decorationOne: {
        position: "absolute",
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: "#BDEFE8",
        opacity: 0.55,
        top: -95,
        right: -40,
    },

    decorationTwo: {
        position: "absolute",
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#DCD8FF",
        opacity: 0.45,
        bottom: -65,
        right: 35,
    },

    badge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: "#E4F8F4",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 24,
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#21B89F",
        marginRight: 8,
    },

    badgeText: {
        color: "#218779",
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1,
    },

    heroTitle: {
        color: "#172337",
        fontSize: 30,
        fontWeight: "900",
        marginBottom: 12,
    },

    heroDescription: {
        color: "#65758A",
        fontSize: 14,
        lineHeight: 23,
    },

    // Accesos rápidos
    section: {
        marginBottom: 20,
    },

    sectionTitle: {
        color: "#172337",
        fontSize: 22,
        fontWeight: "800",
    },

    sectionSubtitle: {
        color: "#7A8799",
        fontSize: 13,
        marginTop: 6,
    },

    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E3EAF2",
        borderRadius: 21,
        padding: 17,
        marginBottom: 15,
        minHeight: 100,
        elevation: 2,
        shadowColor: "#31465A",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
    },

    optionIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },

    profileIcon: {
        backgroundColor: "#E4F0FF",
    },

    settingsIcon: {
        backgroundColor: "#EEE9FF",
    },

    emoji: {
        fontSize: 24,
    },

    optionInfo: {
        flex: 1,
    },

    optionTitle: {
        color: "#172337",
        fontSize: 16,
        fontWeight: "800",
        marginBottom: 6,
    },

    optionDescription: {
        color: "#7A8799",
        fontSize: 12,
        lineHeight: 18,
    },

    arrow: {
        color: "#239D91",
        fontSize: 30,
        marginLeft: 10,
    },
});
