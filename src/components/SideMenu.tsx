
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSelector } from "react-redux";

import { SideMenuProps } from "../interfaces/menu.interface";
import { RootState } from "../store/store";
import MenuItem from "./MenuItem";

export default function SideMenu({
    visible,
    onClose,
    onProfile,
    onSettings,
    onLogout,
}: SideMenuProps) {
    const user = useSelector(
        (state: RootState) => state.auth.user
    );

    if (!visible) {
        return null;
    }

    const displayName = user?.nombre
        ? `${user.nombre} ${user.apellido || ""}`.trim()
        : user?.email
            ? user.email.split("@")[0]
            : "Alumno";

    const initial = displayName.charAt(0).toUpperCase();

    return (
        <View style={styles.overlay}>
            {/* MENÚ LATERAL */}
            <View style={styles.menu}>
                {/* ENCABEZADO */}
                <View style={styles.header}>
                    <View style={styles.headerDecoration} />

                    <View style={styles.headerTop}>
                        <View style={styles.brandIcon}>
                            <Text style={styles.brandIconText}>
                                A
                            </Text>
                        </View>

                        <Text style={styles.brandName}>
                            Mi espacio
                        </Text>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                            accessibilityLabel="Cerrar menú"
                        >
                            <Text style={styles.closeButtonText}>
                                ×
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.userInfo}>
                        <View style={styles.avatarBorder}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {initial}
                                </Text>
                            </View>

                            <View style={styles.onlineIndicator} />
                        </View>

                        <Text
                            style={styles.name}
                            numberOfLines={2}
                        >
                            {displayName}
                        </Text>

                        <Text
                            style={styles.email}
                            numberOfLines={1}
                        >
                            {user?.email || "Sin correo registrado"}
                        </Text>

                        <View style={styles.accountBadge}>
                            <Text style={styles.accountBadgeText}>
                                Mi cuenta
                            </Text>
                        </View>
                    </View>
                </View>

                {/* NAVEGACIÓN */}
                <View style={styles.navigation}>
                    <Text style={styles.sectionLabel}>
                        MENÚ PRINCIPAL
                    </Text>

                    <View style={styles.menuItemWrapper}>
                        <MenuItem
                            title="Inicio"
                            icon="🏠"
                            onPress={onClose}
                        />
                    </View>

                    <View style={styles.menuItemWrapper}>
                        <MenuItem
                            title="Mi Perfil"
                            icon="👤"
                            onPress={onProfile}
                        />
                    </View>

                    <View style={styles.menuItemWrapper}>
                        <MenuItem
                            title="Configuración"
                            icon="⚙️"
                            onPress={onSettings}
                        />
                    </View>
                </View>

                {/* ESPACIO FLEXIBLE */}
                <View style={styles.spacer} />

                {/* PIE DEL MENÚ */}
                <View style={styles.footer}>
                    <View style={styles.footerDivider} />

                    <TouchableOpacity
                        style={styles.logout}
                        onPress={onLogout}
                        activeOpacity={0.75}
                    >
                        <View style={styles.logoutIconContainer}>
                            <Text style={styles.logoutIcon}>
                                ↪
                            </Text>
                        </View>

                        <View style={styles.logoutInfo}>
                            <Text style={styles.logoutText}>
                                Cerrar sesión
                            </Text>

                            <Text style={styles.logoutSubtitle}>
                                Salir de tu cuenta
                            </Text>
                        </View>

                        <Text style={styles.logoutArrow}>
                            ›
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.footerText}>
                        TU ESPACIO PERSONAL
                    </Text>
                </View>
            </View>

            {/* FONDO PARA CERRAR EL MENÚ */}
            <TouchableOpacity
                style={styles.background}
                onPress={onClose}
                activeOpacity={1}
                accessibilityLabel="Cerrar menú lateral"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        zIndex: 1000,
        backgroundColor: "transparent",
    },

    // Contenedor principal
    menu: {
        width: "82%",
        maxWidth: 360,
        height: "100%",
        backgroundColor: "#FFFFFF",
        paddingTop: 0,
        paddingBottom: 15,
        elevation: 15,
        shadowColor: "#17243A",
        shadowOffset: {
            width: 4,
            height: 0,
        },
        shadowOpacity: 0.16,
        shadowRadius: 12,
    },

    // Encabezado azul
    header: {
        backgroundColor: "#2868D7",
        paddingTop: 48,
        paddingHorizontal: 22,
        paddingBottom: 25,
        overflow: "hidden",
    },

    headerDecoration: {
        position: "absolute",
        width: 190,
        height: 190,
        borderRadius: 95,
        backgroundColor: "#FFFFFF",
        opacity: 0.07,
        top: -105,
        right: -55,
    },

    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 28,
    },

    brandIcon: {
        width: 35,
        height: 35,
        borderRadius: 11,
        backgroundColor: "rgba(255,255,255,0.20)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
    },

    brandIconText: {
        color: "#FFFFFF",
        fontSize: 19,
        fontWeight: "900",
    },

    brandName: {
        flex: 1,
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "800",
        letterSpacing: 0.2,
    },

    closeButton: {
        width: 34,
        height: 34,
        borderRadius: 11,
        backgroundColor: "rgba(255,255,255,0.16)",
        alignItems: "center",
        justifyContent: "center",
    },

    closeButtonText: {
        color: "#FFFFFF",
        fontSize: 27,
        lineHeight: 30,
        marginTop: -2,
    },

    // Usuario
    userInfo: {
        alignItems: "center",
    },

    avatarBorder: {
        width: 86,
        height: 86,
        borderRadius: 43,
        padding: 4,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.65)",
        marginBottom: 13,
        position: "relative",
    },

    avatar: {
        flex: 1,
        borderRadius: 40,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        color: "#2868D7",
        fontSize: 32,
        fontWeight: "900",
    },

    onlineIndicator: {
        position: "absolute",
        right: 0,
        bottom: 1,
        width: 17,
        height: 17,
        borderRadius: 9,
        backgroundColor: "#38C98A",
        borderWidth: 3,
        borderColor: "#2868D7",
    },

    name: {
        color: "#FFFFFF",
        fontSize: 19,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 5,
    },

    email: {
        color: "#DCE8FF",
        fontSize: 12,
        textAlign: "center",
        marginBottom: 12,
    },

    accountBadge: {
        backgroundColor: "rgba(255,255,255,0.16)",
        borderRadius: 20,
        paddingHorizontal: 13,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.20)",
    },

    accountBadgeText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "700",
    },

    // Navegación
    navigation: {
        paddingHorizontal: 16,
        paddingTop: 27,
    },

    sectionLabel: {
        color: "#94A3B8",
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.5,
        marginLeft: 8,
        marginBottom: 15,
    },

    menuItemWrapper: {
        marginBottom: 9,
        borderRadius: 15,
        overflow: "hidden",
    },

    spacer: {
        flex: 1,
        minHeight: 20,
    },

    // Pie
    footer: {
        paddingHorizontal: 16,
    },

    footerDivider: {
        height: 1,
        backgroundColor: "#E8EDF4",
        marginBottom: 15,
    },

    logout: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF3F4",
        borderWidth: 1,
        borderColor: "#FFE0E4",
        borderRadius: 17,
        paddingHorizontal: 12,
        paddingVertical: 13,
    },

    logoutIconContainer: {
        width: 43,
        height: 43,
        borderRadius: 13,
        backgroundColor: "#FFE1E5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    logoutIcon: {
        color: "#D93650",
        fontSize: 27,
        fontWeight: "700",
    },

    logoutInfo: {
        flex: 1,
    },

    logoutText: {
        color: "#C92F48",
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 4,
    },

    logoutSubtitle: {
        color: "#9F6670",
        fontSize: 11,
    },

    logoutArrow: {
        color: "#D93650",
        fontSize: 26,
        marginLeft: 5,
    },

    footerText: {
        color: "#A0AABA",
        fontSize: 9,
        textAlign: "center",
        letterSpacing: 1.5,
        fontWeight: "700",
        marginTop: 17,
    },

    // Fondo semitransparente
    background: {
        flex: 1,
        backgroundColor: "rgba(23, 36, 58, 0.35)",
    },
});
