
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { logout } from "../store/store";
import { closeSession } from "../utils/logout";

export default function SettingsScreen() {
    const router = useRouter();
    const dispatch = useDispatch();

    
    const handleLogout = async () => {
    try {
        await closeSession();
        dispatch(logout());
        router.replace("/");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);

        Alert.alert(
        "Aviso",
        "La sesión local se cerró, pero no se pudo confirmar la revocación en el servidor."
        );

        dispatch(logout());
        router.replace("/");
    }
    };

    const options = [
        {
            icon: "ⓘ",
            title: "Información de la app",
            description: "Conoce más sobre la aplicación",
            color: "#EAF1FF",
            iconColor: "#3978E8",
        },
        {
            icon: "⚙",
            title: "Preferencias",
            description: "Opciones generales de la aplicación",
            color: "#F0EBFF",
            iconColor: "#8257D8",
        },
        {
            icon: "♧",
            title: "Notificaciones",
            description: "Opciones de avisos y notificaciones",
            color: "#E5F6EE",
            iconColor: "#24966A",
        },
        {
            icon: "🔒",
            title: "Privacidad",
            description: "Información sobre tu privacidad",
            color: "#FFF0F3",
            iconColor: "#D94B70",
        },
        {
            icon: "?",
            title: "Ayuda y soporte",
            description: "Consulta información de ayuda",
            color: "#EEF0FF",
            iconColor: "#5869CF",
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#F5F7FB"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* ENCABEZADO */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace("/home");
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.back}>‹</Text>
                    </TouchableOpacity>

                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>
                            Configuración
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Personaliza tu experiencia
                        </Text>
                    </View>

                    <View style={styles.headerPlaceholder} />
                </View>

                {/* TARJETA INTRODUCTORIA */}
                <View style={styles.heroCard}>
                    <View style={styles.heroDecoration} />

                    <View style={styles.heroIconContainer}>
                        <Text style={styles.heroIcon}>⚙</Text>
                    </View>

                    <Text style={styles.heroTitle}>
                        Ajustes de tu cuenta
                    </Text>

                    <Text style={styles.heroDescription}>
                        Consulta las opciones de la aplicación
                        y encuentra información importante sobre tu cuenta.
                    </Text>
                </View>

                {/* OPCIONES INFORMATIVAS */}
                <Text style={styles.sectionTitle}>
                    General
                </Text>

                <View style={styles.optionsContainer}>
                    {options.map((item) => (
                        <View
                            key={item.title}
                            style={styles.optionCard}
                        >
                            <View
                                style={[
                                    styles.optionIconContainer,
                                    { backgroundColor: item.color },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.optionIcon,
                                        { color: item.iconColor },
                                    ]}
                                >
                                    {item.icon}
                                </Text>
                            </View>

                            <View style={styles.optionInfo}>
                                <Text style={styles.optionTitle}>
                                    {item.title}
                                </Text>

                                <Text style={styles.optionDescription}>
                                    {item.description}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* ÚNICO BOTÓN FUNCIONAL */}
                <TouchableOpacity
                    style={styles.logout}
                    onPress={handleLogout}
                    activeOpacity={0.75}
                >
                    <View style={styles.logoutIconContainer}>
                        <Text style={styles.logoutIcon}>↪</Text>
                    </View>

                    <View style={styles.logoutInfo}>
                        <Text style={styles.logoutTitle}>
                            Cerrar sesión
                        </Text>
                        <Text style={styles.logoutDescription}>
                            Salir de tu cuenta de forma segura
                        </Text>
                    </View>

                    <Text style={styles.logoutArrow}>›</Text>
                </TouchableOpacity>

                <Text style={styles.footer}>
                    CONFIGURACIÓN · TU CUENTA
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

    headerTextContainer: {
        flex: 1,
        marginLeft: 14,
    },

    headerTitle: {
        color: "#17243A",
        fontSize: 21,
        fontWeight: "800",
    },

    headerSubtitle: {
        color: "#718096",
        fontSize: 12,
        marginTop: 5,
    },

    headerPlaceholder: {
        width: 5,
    },

    // Tarjeta introductoria
    heroCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 22,
        marginBottom: 30,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E4EAF3",
        elevation: 2,
        shadowColor: "#25334A",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },

    heroDecoration: {
        position: "absolute",
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: "#3978E8",
        opacity: 0.08,
        top: -95,
        right: -40,
    },

    heroIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#EAF1FF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },

    heroIcon: {
        color: "#3978E8",
        fontSize: 30,
    },

    heroTitle: {
        color: "#17243A",
        fontSize: 21,
        fontWeight: "800",
        marginBottom: 9,
    },

    heroDescription: {
        color: "#64748B",
        fontSize: 13,
        lineHeight: 21,
    },

    // Lista informativa
    sectionTitle: {
        color: "#17243A",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 15,
    },

    optionsContainer: {
        gap: 12,
        marginBottom: 28,
    },

    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E4EAF3",
        borderRadius: 20,
        padding: 15,
        minHeight: 86,
    },

    optionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    optionIcon: {
        fontSize: 23,
        fontWeight: "700",
    },

    optionInfo: {
        flex: 1,
    },

    optionTitle: {
        color: "#263449",
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 6,
    },

    optionDescription: {
        color: "#718096",
        fontSize: 11,
        lineHeight: 16,
    },

    // Cerrar sesión
    logout: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF1F2",
        borderWidth: 1,
        borderColor: "#FFD5DB",
        borderRadius: 20,
        padding: 15,
    },

    logoutIconContainer: {
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
        fontSize: 28,
        fontWeight: "700",
    },

    logoutInfo: {
        flex: 1,
    },

    logoutTitle: {
        color: "#D93650",
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 5,
    },

    logoutDescription: {
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
