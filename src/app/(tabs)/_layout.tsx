/**
 * Layout de tabs con navegación inferior y menú lateral.
 * Incluye badge dinámico del carrito en Estudiantes.
 */

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import SideMenu from "../../components/SideMenu";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import type { RootState } from "../../store/store";

export default function TabLayout() {
  // Contexto del carrito
  const { itemCount } = useCart();

  // Contexto del tema
  const { colors } = useTheme();

  // Estado del menú lateral
  const [menuOpen, setMenuOpen] = useState(false);

  // Usuario autenticado
  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  // Solamente los usuarios con kind "user" son administradores
  const isAdmin = user?.kind === "user";

  // Badge dinámico del carrito
  const cartBadge =
    isAdmin && itemCount > 0
      ? itemCount > 99
        ? "99+"
        : itemCount
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

          // Botón para abrir el menú lateral
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

            tabBarIcon: (props) => (
              <Ionicons
                name={
                  props.focused
                    ? "home"
                    : "home-outline"
                }
                color={
                  props.focused
                    ? colors.primary
                    : colors.secondary
                }
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

            tabBarIcon: (props) => (
              <Ionicons
                name={
                  props.focused
                    ? "people"
                    : "people-outline"
                }
                color={
                  props.focused
                    ? colors.primary
                    : colors.secondary
                }
                size={props.size}
              />
            ),

            // Contador del carrito
            tabBarBadge: cartBadge,

            tabBarBadgeStyle: {
              backgroundColor: "#EF4444",
              color: "#FFFFFF",
              fontSize: 10,
              fontWeight: "bold",
              minWidth: 18,
              height: 18,
              borderRadius: 9,
            },
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
                name={
                  props.focused
                    ? "person"
                    : "person-outline"
                }
                color={
                  props.focused
                    ? colors.primary
                    : colors.secondary
                }
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
                name={
                  props.focused
                    ? "settings"
                    : "settings-outline"
                }
                color={
                  props.focused
                    ? colors.primary
                    : colors.secondary
                }
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