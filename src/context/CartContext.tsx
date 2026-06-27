import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

export interface CartItem {
  cartItemId: string;
  id: string;
  brand: string;
  name: string;
  price: number;
  imageUrl: string;
  selectedColor: string;
  hexCode: string;
  selectedStorage: string;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "cartItemId" | "quantity">) => void;
  cartCount: number;
  clearCart: () => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("shopping-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("shopping-cart", JSON.stringify(cart));
  }, [cart]);

  const safePrice = (price: any): number => {
    const parsed = parseFloat(price);
    return isNaN(parsed) ? 0 : parsed;
  };

  const addToCart = (newItem: Omit<CartItem, "cartItemId" | "quantity">) => {
    const cartItemId = `${newItem.id}-${newItem.hexCode}-${newItem.selectedStorage.replace(/\s/g, "")}`;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.cartItemId === cartItemId,
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      }

      const cleanItem = {
        ...newItem,
        price: safePrice(newItem.price),
        cartItemId,
        quantity: 1
      };

      return [...prevCart, cleanItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartItemId !== cartItemId),
    );
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        cartCount,
        clearCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }

  return context;
}
