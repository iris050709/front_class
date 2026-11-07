import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { useTheme } from "../context/ThemeContext";

export default function CartTestScreen() {
  const {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const { colors, theme, toggleTheme } = useTheme();

  const {
    showSuccess,
    showWarning,
    showInfo,
  } = useNotification();

  const isDark = theme === "dark";

  const dangerColor = isDark ? "#F87171" : "#DC2626";

  const products = [
    { id: 1, name: "Producto 1", price: 100 },
    { id: 2, name: "Producto 2", price: 50 },
    { id: 3, name: "Producto 3", price: 75 },
  ];

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  // Agregar producto
  const addProduct = (product: (typeof products)[number]) => {
    addItem({ ...product, quantity: 1 });

    showSuccess(
      "Producto agregado",
      `${product.name} se agregó al carrito.`
    );
  };

  // Eliminar producto
  const handleRemove = (id: number, name: string) => {
    removeItem(id);
    showInfo("Producto eliminado", `${name} se eliminó del carrito.`);
  };

  // Actualizar cantidad
  const handleQuantity = (
    id: number,
    name: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(id);
      showInfo("Producto eliminado", `${name} se eliminó del carrito.`);
      return;
    }

    updateQuantity(id, quantity);

    showSuccess(
      "Cantidad actualizada",
      `Nueva cantidad de ${name}: ${quantity}.`
    );
  };

  // Vaciar carrito
  const handleClearCart = () => {
    if (items.length === 0) {
      showWarning("Carrito vacío", "No hay productos para eliminar.");
      return;
    }

    clearCart();

    showSuccess(
      "Carrito vaciado",
      "Se eliminaron todos los productos correctamente."
    );
  };

  // Cambiar tema
  const handleThemeChange = () => {
    toggleTheme();

    showInfo(
      "Tema actualizado",
      `Se cambió al modo ${isDark ? "claro" : "oscuro"}.`
    );
  };

  return (
    <>
      {/* ENCABEZADO SUPERIOR DE EXPO ROUTER */}
      <Stack.Screen
        options={{
          title: "Carrito de compras",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
            fontWeight: "600",
          },
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        style={[
          styles.scroll,
          { backgroundColor: colors.background },
        ]}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.eyebrow, { color: colors.secondary }]}>
              MÓDULO DE PRUEBAS
            </Text>

            <Text style={[styles.title, { color: colors.text }]}>
              Carrito de compras
            </Text>

            <Text style={[styles.description, { color: colors.secondary }]}>
              Administración y control de productos.
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleThemeChange}
              activeOpacity={0.7}
              accessibilityLabel="Cambiar tema"
            >
              <Ionicons
                name={isDark ? "sunny-outline" : "moon-outline"}
                size={21}
                color={colors.primary}
              />
            </TouchableOpacity>

            <View
              style={[
                styles.headerIcon,
                { backgroundColor: colors.card },
              ]}
            >
              <Ionicons
                name="cart-outline"
                size={27}
                color={colors.primary}
              />
            </View>
          </View>
        </View>

        {/* Resumen */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text style={styles.summaryLabel}>Total del carrito</Text>

          <Text style={styles.summaryAmount}>
            {formatPrice(total)}
          </Text>

          <View style={styles.summaryFooter}>
            <View style={styles.summaryInfo}>
              <Ionicons name="cube-outline" size={17} color="#FFFFFF" />
              <Text style={styles.summaryText}>
                {itemCount} unidades
              </Text>
            </View>

            <View style={styles.summaryInfo}>
              <Ionicons name="layers-outline" size={17} color="#FFFFFF" />
              <Text style={styles.summaryText}>
                {items.length} productos diferentes
              </Text>
            </View>
          </View>
        </View>

        {/* Productos disponibles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Productos disponibles
            </Text>

            <Text style={[styles.sectionCaption, { color: colors.secondary }]}>
              Selecciona para agregar
            </Text>
          </View>

          {products.map((product) => {
            const exists = items.some((item) => item.id === product.id);

            return (
              <View
                key={product.id}
                style={[
                  styles.productCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.productInfo}>
                  <View
                    style={[
                      styles.productIcon,
                      { backgroundColor: colors.background },
                    ]}
                  >
                    <Ionicons
                      name="cube-outline"
                      size={22}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.productDetails}>
                    <Text style={[styles.productName, { color: colors.text }]}>
                      {product.name}
                    </Text>

                    <Text style={[styles.productPrice, { color: colors.secondary }]}>
                      {formatPrice(product.price)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.addButton,
                    {
                      backgroundColor: exists
                        ? colors.background
                        : colors.primary,
                      borderColor: colors.primary,
                      borderWidth: exists ? 1 : 0,
                    },
                  ]}
                  onPress={() => addProduct(product)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="add"
                    size={19}
                    color={exists ? colors.primary : "#FFFFFF"}
                  />

                  <Text
                    style={[
                      styles.addButtonText,
                      {
                        color: exists ? colors.primary : "#FFFFFF",
                      },
                    ]}
                  >
                    Agregar
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Productos en el carrito */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Productos en el carrito
            </Text>

            {items.length > 0 && (
              <TouchableOpacity
                onPress={handleClearCart}
                style={styles.clearButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="trash-outline"
                  size={15}
                  color={dangerColor}
                />

                <Text style={[styles.clearText, { color: dangerColor }]}>
                  Vaciar carrito
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {items.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="cart-outline"
                size={38}
                color={colors.secondary}
              />

              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Carrito vacío
              </Text>

              <Text style={[styles.emptyDescription, { color: colors.secondary }]}>
                Agrega productos para comenzar a probar las funciones.
              </Text>
            </View>
          ) : (
            items.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.cartCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.cartTop}>
                  <View style={styles.cartProductInfo}>
                    <Text style={[styles.productName, { color: colors.text }]}>
                      {item.name}
                    </Text>

                    <Text style={[styles.productPrice, { color: colors.secondary }]}>
                      {formatPrice(item.price)} por unidad
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleRemove(item.id, item.name)}
                    style={[
                      styles.deleteButton,
                      {
                        backgroundColor: isDark ? "#3B2528" : "#FEE2E2",
                      },
                    ]}
                    activeOpacity={0.7}
                    accessibilityLabel={`Eliminar ${item.name}`}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={19}
                      color={dangerColor}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.cartBottom}>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        { borderColor: colors.border },
                      ]}
                      onPress={() =>
                        handleQuantity(item.id, item.name, item.quantity - 1)
                      }
                      activeOpacity={0.7}
                    >
                      <Ionicons name="remove" size={17} color={colors.text} />
                    </TouchableOpacity>

                    <Text style={[styles.quantityText, { color: colors.text }]}>
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.quantityButton,
                        { borderColor: colors.border },
                      ]}
                      onPress={() =>
                        handleQuantity(item.id, item.name, item.quantity + 1)
                      }
                      activeOpacity={0.7}
                    >
                      <Ionicons name="add" size={17} color={colors.text} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.subtotalContainer}>
                    <Text style={[styles.subtotalLabel, { color: colors.secondary }]}>
                      Subtotal
                    </Text>

                    <Text style={[styles.subtotal, { color: colors.text }]}>
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Resumen final */}
        <View
          style={[
            styles.totalCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.totalLabel, { color: colors.secondary }]}>
            Total de la compra
          </Text>

          <Text style={[styles.totalAmount, { color: colors.text }]}>
            {formatPrice(total)}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.totalRow}>
            <Text style={{ color: colors.secondary }}>Unidades totales</Text>
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {itemCount}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={{ color: colors.secondary }}>Productos diferentes</Text>
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {items.length}
            </Text>
          </View>
        </View>

        <Text style={[styles.footer, { color: colors.secondary }]}>
          Pantalla de pruebas · CartContext
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
  },
  description: {
    fontSize: 13,
    marginTop: 5,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  themeButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    padding: 22,
    borderRadius: 16,
    gap: 10,
  },
  summaryLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    opacity: 0.9,
  },
  summaryAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },
  summaryFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 8,
  },
  summaryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  summaryText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    gap: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  sectionCaption: {
    fontSize: 11,
  },
  productCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  productIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  productDetails: {
    flex: 1,
    gap: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
  },
  productPrice: {
    fontSize: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  clearText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 28,
    alignItems: "center",
    gap: 9,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  emptyDescription: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  cartCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    gap: 15,
  },
  cartTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartProductInfo: {
    flex: 1,
    gap: 5,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 9,
  },
  cartBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "700",
    minWidth: 18,
    textAlign: "center",
  },
  subtotalContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  subtotalLabel: {
    fontSize: 11,
  },
  subtotal: {
    fontSize: 15,
    fontWeight: "700",
  },
  totalCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    gap: 10,
  },
  totalLabel: {
    fontSize: 13,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginVertical: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer: {
    textAlign: "center",
    fontSize: 11,
  },
});