
/**
 * Layout de tabs con navegación inferior y menú lateral.
 * Inicio: contador dinámico de productos del carrito.
 * Estudiantes: contador dinámico de estudiantes registrados.
 * Autenticación mediante AuthContext.
 */

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

import SideMenu from "../../components/SideMenu";
import { useAuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useStudents } from "../../hooks/useStudents";

export default function TabLayout() {
    // Contexto del carrito
    const { itemCount } = useCart();

    // Contexto del tema
    const { colors } = useTheme();

    // Contexto de autenticación
    const { user, initializing } = useAuthContext();

    // Obtener estudiantes registrados
    const { students, loading: studentsLoading } = useStudents();

    // Estado del menú lateral
    const [menuOpen, setMenuOpen] = useState(false);

    // Evitar renderizar las tabs antes de comprobar la sesión
    if (initializing) {
        return null;
    }

    // Solamente los usuarios con kind "user" son administradores
    const isAdmin = user?.kind === "user";

    // Contador de productos del carrito
    const cartBadge =
        itemCount > 0
            ? itemCount > 99
                ? "99+"
                : itemCount
            : undefined;

    // Contador de estudiantes registrados
    const studentsBadge =
        isAdmin && !studentsLoading && students.length > 0
            ? students.length > 99
                ? "99+"
                : students.length
            : undefined;

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.secondary,

                    tabBarStyle: {
                        backgroundColor: colors.background,
                        borderTopColor: colors.border,
                        borderTopWidth: 1,
                        height: 60,
                        paddingBottom: 8,
                        paddingTop: 8,
                    },

                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: "500",
                    },

                    headerStyle: {
                        backgroundColor: colors.background,
                    },

                    headerTintColor: colors.text,

                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => setMenuOpen(true)}
                            style={{
                                marginLeft: 15,
                                padding: 5,
                            }}
                            accessibilityLabel="Abrir menú lateral"
                            accessibilityRole="button"
                        >
                            <Ionicons
                                name="menu"
                                size={27}
                                color={colors.text}
                            />
                        </TouchableOpacity>
                    ),
                }}
            >
                {/* Inicio */}
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Inicio",
                        tabBarLabel: "Inicio",

                        // Contador de productos del carrito
                        tabBarBadge: cartBadge,

                        tabBarBadgeStyle: {
                            backgroundColor: "#2563EB",
                            color: "#FFFFFF",
                            fontSize: 10,
                            fontWeight: "bold",
                            minWidth: 18,
                            height: 18,
                            borderRadius: 9,
                        },

                        tabBarIcon: (props) => (
                            <Ionicons
                                name={props.focused ? "home" : "home-outline"}
                                color={props.focused ? colors.primary : colors.secondary}
                                size={props.size}
                            />
                        ),
                    }}
                />

                {/* Estudiantes */}
                <Tabs.Screen
                    name="students"
                    options={{
                        title: "Estudiantes",
                        tabBarLabel: "Estudiantes",

                        // Solo los administradores pueden acceder
                        href: isAdmin ? "/(tabs)/students" : null,

                        // Contador de estudiantes registrados
                        tabBarBadge: studentsBadge,

                        tabBarBadgeStyle: {
                            backgroundColor: "#EF4444",
                            color: "#FFFFFF",
                            fontSize: 10,
                            fontWeight: "bold",
                            minWidth: 18,
                            height: 18,
                            borderRadius: 9,
                        },

                        tabBarIcon: (props) => (
                            <Ionicons
                                name={props.focused ? "people" : "people-outline"}
                                color={props.focused ? colors.primary : colors.secondary}
                                size={props.size}
                            />
                        ),
                    }}
                />

                {/* Perfil */}
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Perfil",
                        tabBarLabel: "Perfil",

                        tabBarIcon: (props) => (
                            <Ionicons
                                name={props.focused ? "person" : "person-outline"}
                                color={props.focused ? colors.primary : colors.secondary}
                                size={props.size}
                            />
                        ),
                    }}
                />

                {/* Ajustes */}
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: "Ajustes",
                        tabBarLabel: "Ajustes",

                        tabBarIcon: (props) => (
                            <Ionicons
                                name={props.focused ? "settings" : "settings-outline"}
                                color={props.focused ? colors.primary : colors.secondary}
                                size={props.size}
                            />
                        ),
                    }}
                />
            </Tabs>

            {/* Menú lateral */}
            <SideMenu
                visible={menuOpen}
                onClose={() => setMenuOpen(false)}
            />
        </>
    );
}
