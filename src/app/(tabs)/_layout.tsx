/**
 * Layout de tabs con navegación inferior y menú lateral
 */

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

import SideMenu from '../../components/SideMenu';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { RootState } from '../../store/store';

export default function TabLayout() {
  const { itemCount } = useCart();
  const { colors } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const isAdmin = user?.kind === 'user';

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
            fontWeight: '500',
          },

          headerStyle: {
            backgroundColor: colors.background,
          },

          headerTintColor: colors.text,

          // Botón del menú lateral.
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setMenuOpen(true)}
              style={{ marginLeft: 15, padding: 5 }}
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
            title: 'Inicio',
            tabBarLabel: 'Inicio',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />

        {/* Estudiantes: solamente administrador */}
        <Tabs.Screen
          name="students"
          options={{
            title: 'Estudiantes',
            tabBarLabel: 'Estudiantes',
            href: isAdmin ? '/(tabs)/students' : null,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'people' : 'people-outline'}
                color={color}
                size={size}
              />
            ),
            tabBarBadge:
              isAdmin && itemCount > 0
                ? itemCount
                : undefined,
            tabBarBadgeStyle: {
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              fontSize: 10,
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
            title: 'Perfil',
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />

        {/* Ajustes */}
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Ajustes',
            tabBarLabel: 'Ajustes',
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                color={color}
                size={size}
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