/**
 * Componente de indicador de carga
 * Muestra un spinner mientras se cargan datos
 */

import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text } from 'react-native';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean; //DECLARAR PROPIEDAD OPCIONAL fullScreen PARA USO EN LOGIN
}

export default function Loading({ message = 'Cargando...', size = 'large', fullScreen = false }: LoadingProps) {//agregar fullScreen como prop opcional con valor por defecto false
  /**
   * ERROR #10: Orden de Hooks
   * 
   * REGLA DE ORO:
   * - React hooks DEBEN llamarse en el mismo orden en cada render
   * - Orden correcto: useState/useRef primero, useEffect después
   * 
   * ❌ CÓDIGO INCORRECTO (ANTES):
   * useEffect(() => { ... }, [fadeAnim]);  // ❌ Hook 1 - MAL ORDEN
   * const fadeAnim = useRef(new Animated.Value(0)).current;  // ❌ Hook 2
   * 
   * PROBLEMA SI SE INVIERTE:
   * - Error: "Rendered more hooks than during the previous render"
   * - React mantiene un array interno de hooks, el orden es crítico
   * 
   * ✅ SOLUCIÓN:
   * - Mantener orden correcto: useRef primero, useEffect después
   */
  /**
   * ERROR #8: Orden incorrecto de Hooks
   *
   * ANTES (INCORRECTO):
   * useEffect(() => { ... }, [fadeAnim]);
   * const fadeAnim = useRef(new Animated.Value(0)).current;
   *
   * PROBLEMA:
   * - Se utilizaba fadeAnim antes de declararlo.
   * - Los Hooks deben conservar el mismo orden en cada renderizado.
   *
   * SOLUCIÓN:
   * - Declarar useRef antes de useEffect.
   */
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    /**
     * ERROR #1: Memory Leak en Animaciones
     * 
     * ❌ CÓDIGO INCORRECTO (ANTES):
     * useEffect(() => {
     *   Animated.timing(fadeAnim, {
     *     toValue: 1,
     *     duration: 300,
     *     useNativeDriver: true,
     *   }).start();
     * }, [fadeAnim]);
     * 
     * PROBLEMA:
     * - Animated.timing() sin cleanup
     * - Si usuario navega a otra pantalla mientras anima → memory leak
     * - Warning: "Can't perform a React state update on an unmounted component"
     * 
     * ✅ SOLUCIÓN:
     * - Guardar referencia de la animación
     * - Retornar función cleanup que detiene la animación
     */
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      /**
       * ERROR #2: useNativeDriver Incorrecto
       * 
       * ❌ CÓDIGO INCORRECTO (ANTES):
       * useNativeDriver: false
       * 
       * PROBLEMA:
       * - useNativeDriver: false fuerza animación en hilo de JavaScript
       * - La propiedad opacity SÍ soporta native driver
       * - Causa lag en dispositivos antiguos o con muchas animaciones
       * 
       * ✅ SOLUCIÓN:
       * - Usar useNativeDriver: true para animaciones fluidas
       * - Se ejecuta en hilo nativo de UI (60fps garantizados)
       */

      /**
       * ERROR #10: Uso incorrecto de useNativeDriver
       *
       * ANTES (INCORRECTO):
       * useNativeDriver: false
       *
       * PROBLEMA:
       * - La animación se ejecutaba en el hilo de JavaScript.
       * - Podía generar trabajo adicional en ese hilo.
       *
       * SOLUCIÓN:
       * - Utilizar useNativeDriver: true.
       * - La propiedad opacity es compatible con el controlador nativo.
       */

      useNativeDriver: true,
    });

    animation.start();

    // ERROR #9 SOLUCIONADO: Se detiene la animación al desmontar el componente.
    // CLEANUP: Detiene animación si componente se desmonta
    return () => {
      animation.stop();
    };
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, fullScreen && styles.fullScreen, { opacity: fadeAnim }]}>
      <ActivityIndicator size={size} color="#3B82F6" />
      {message && <Text style={styles.message}>{message}</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },
});