/**
 * Layout de tabs para navegación inferior
 * Las pestañas dependen del tipo de usuario.
 */

import { Tabs } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { useSelector } from "react-redux";

import { RootState } from "../../store/store";

export default function TabLayout() {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  // Solo las cuentas de administrador pueden ver Estudiantes.
  const isAdmin = user?.kind === "user";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTitleAlign: "center",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>🏠</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="students"
        options={{
          title: "Estudiantes",
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>👨‍🎓</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Text style={[styles.icon, { color }]}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    paddingBottom: 8,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  icon: {
    fontSize: 24,
  },
});