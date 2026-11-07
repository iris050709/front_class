
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

// Producto
export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Estado del carrito
interface CartState {
  items: Product[];
  total: number;
  itemCount: number;
}

// Funciones y estado del contexto
interface CartContextType extends CartState {
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

// Crear contexto
const CartContext = createContext<CartContextType | undefined>(
  undefined
);

// Props del proveedor
interface CartProviderProps {
  children: ReactNode;
}

// Proveedor del carrito
export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<Product[]>([]);

  // Agregar producto o incrementar cantidad
  const addItem = useCallback((product: Product) => {
    if (
      !Number.isInteger(product.id) ||
      !product.name.trim() ||
      !Number.isFinite(product.price) ||
      product.price < 0 ||
      !Number.isInteger(product.quantity) ||
      product.quantity <= 0
    ) {
      return;
    }

    setItems((previousItems) => {
      const existing = previousItems.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return previousItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + product.quantity,
              }
            : item
        );
      }

      return [...previousItems, { ...product }];
    });
  }, []);

  // Eliminar producto
  const removeItem = useCallback((productId: number) => {
    setItems((previousItems) =>
      previousItems.filter((item) => item.id !== productId)
    );
  }, []);

  // Actualizar cantidad
  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (!Number.isInteger(quantity)) return;

      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      setItems((previousItems) =>
        previousItems.map((item) =>
          item.id === productId
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeItem]
  );

  // Vaciar carrito
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Calcular total
  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [items]
  );

  // Calcular cantidad total de unidades
  const itemCount = useMemo(
    () =>
      items.reduce(
        (count, item) => count + item.quantity,
        0
      ),
    [items]
  );

  // Valor del contexto
  const value = useMemo<CartContextType>(
    () => ({
      items,
      total,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      total,
      itemCount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado
export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe utilizarse dentro de un CartProvider"
    );
  }

  return context;
}
