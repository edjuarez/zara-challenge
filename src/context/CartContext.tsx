import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "cartItemId" | "quantity">) => void;
  cartCount: number;
  clearCart: () => void;
  removeFromCart: (cartItemId: string) => void;
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

  const addToCart = (newItem: Omit<CartItem, "cartItemId" | "quantity">) => {
    const cartItemId = `${newItem.id}-${newItem.hexCode}-${newItem.selectedStorage.replace(/\s/g, "")}`;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        console.log("agrego nuevo o actualizo")
        return updatedCart;
      }

      return [...prevCart, { ...newItem, cartItemId, quantity: 1 }];
    });
  };
  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, cartCount, clearCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser utilizado dentro de un CartProvider");
  }
  return context;
}