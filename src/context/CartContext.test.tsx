import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart, CartItem } from "./CartContext";
import { ReactNode } from "react";

// ===========================================================================
// 1. Mocks and Test Setup
// ===========================================================================

// A reusable factory to create mock items for adding to the cart.
const createMockItem = (
  overrides: Partial<Omit<CartItem, "cartItemId" | "quantity">>,
): Omit<CartItem, "cartItemId" | "quantity"> => ({
  id: "prod-1",
  brand: "TestBrand",
  name: "Test Phone",
  price: 1000,
  imageUrl: "test.jpg",
  selectedColor: "Black",
  hexCode: "#000000",
  selectedStorage: "256GB",
  ...overrides,
});

// A custom wrapper for `renderHook` that provides the `CartProvider`.
const renderCartHook = () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );
  return renderHook(() => useCart(), { wrapper });
};

describe("CartContext", () => {
  // Mock localStorage
  let storage: { [key: string]: string } = {};

  beforeEach(() => {
    storage = {};
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(
      (key, value) => (storage[key] = value),
    );
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(
      (key) => storage[key] ?? null,
    );
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ===========================================================================
  // 2. Initialization and Persistence
  // ===========================================================================

  describe("Initialization and Persistence", () => {
    it("should initialize with an empty cart if localStorage is empty", () => {
      // Arrange: localStorage is empty (default state of our mock)
      // Act
      const { result } = renderCartHook();

      // Assert
      expect(result.current.cart).toEqual([]);
      expect(result.current.cartCount).toBe(0);
    });

    it("should initialize with data from localStorage if it exists", () => {
      // Arrange
      const mockCart: CartItem[] = [
        {
          ...createMockItem({ id: "prod-1" }),
          cartItemId: "prod-1-#000000-256GB",
          quantity: 2,
        },
      ];
      storage["shopping-cart"] = JSON.stringify(mockCart);

      // Act
      const { result } = renderCartHook();

      // Assert
      expect(result.current.cart).toEqual(mockCart);
      expect(result.current.cartCount).toBe(2);
    });

    it("should persist cart changes to localStorage", () => {
      // Arrange
      const { result } = renderCartHook();
      const newItem = createMockItem({ id: "prod-1" });

      // Act
      act(() => {
        result.current.addToCart(newItem);
      });

      // Assert
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        "shopping-cart",
        expect.any(String),
      );
      const storedCart = JSON.parse(storage["shopping-cart"]);
      expect(storedCart).toHaveLength(1);
      expect(storedCart[0].quantity).toBe(1);
    });
  });

  // ===========================================================================
  // 3. addToCart Logic
  // ===========================================================================

  describe("addToCart", () => {
    it("should add a new item to the cart with quantity 1", () => {
      // Arrange
      const { result } = renderCartHook();
      const newItem = createMockItem({ id: "prod-new" });

      // Act
      act(() => {
        result.current.addToCart(newItem);
      });

      // Assert
      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0]).toMatchObject({
        ...newItem,
        quantity: 1,
      });
      expect(result.current.cartCount).toBe(1);
    });

    it("should increase the quantity if the same item (id, color, storage) is added again", () => {
      // Arrange
      const { result } = renderCartHook();
      const item = createMockItem({ id: "prod-1" });

      // Act
      act(() => result.current.addToCart(item));
      act(() => result.current.addToCart(item));

      // Assert
      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0].quantity).toBe(2);
      expect(result.current.cartCount).toBe(2);
    });

    it("should add a new item if the storage is different", () => {
      // Arrange
      const { result } = renderCartHook();
      const item1 = createMockItem({ selectedStorage: "256GB" });
      const item2 = createMockItem({ selectedStorage: "512GB" });

      // Act
      act(() => result.current.addToCart(item1));
      act(() => result.current.addToCart(item2));

      // Assert
      expect(result.current.cart).toHaveLength(2);
      expect(result.current.cartCount).toBe(2);
    });

    it("should add a new item if the color is different", () => {
      // Arrange
      const { result } = renderCartHook();
      const item1 = createMockItem({ selectedColor: "Black", hexCode: "#000" });
      const item2 = createMockItem({ selectedColor: "White", hexCode: "#FFF" });

      // Act
      act(() => result.current.addToCart(item1));
      act(() => result.current.addToCart(item2));

      // Assert
      expect(result.current.cart).toHaveLength(2);
      expect(result.current.cartCount).toBe(2);
    });

    it("should handle string prices and convert them to numbers", () => {
      // Arrange
      const { result } = renderCartHook();
      const item = createMockItem({ price: "1250.50" as any });

      // Act
      act(() => result.current.addToCart(item));

      // Assert
      expect(result.current.cart[0].price).toBe(1250.5);
    });

    it("should treat invalid prices (NaN, undefined) as 0", () => {
      // Arrange
      const { result } = renderCartHook();
      const itemNaN = createMockItem({ price: NaN });
      const itemUndefined = createMockItem({ id: "prod-2", price: undefined as any });

      // Act
      act(() => result.current.addToCart(itemNaN));
      act(() => result.current.addToCart(itemUndefined));

      // Assert
      expect(result.current.cart[0].price).toBe(0);
      expect(result.current.cart[1].price).toBe(0);
    });
  });

  // ===========================================================================
  // 4. Item Manipulation (Update, Remove, Clear)
  // ===========================================================================

  describe("Item Manipulation", () => {
    it("should remove an item from the cart", () => {
      // Arrange
      const { result } = renderCartHook();
      const item = createMockItem({ id: "prod-1" });
      act(() => result.current.addToCart(item));
      const cartItemId = result.current.cart[0].cartItemId;

      // Act
      act(() => result.current.removeFromCart(cartItemId));

      // Assert
      expect(result.current.cart).toHaveLength(0);
      expect(result.current.cartCount).toBe(0);
    });

    it("should update the quantity of an item", () => {
      // Arrange
      const { result } = renderCartHook();
      const item = createMockItem({ id: "prod-1" });
      act(() => result.current.addToCart(item));
      const cartItemId = result.current.cart[0].cartItemId;

      // Act
      act(() => result.current.updateQuantity(cartItemId, 5));

      // Assert
      expect(result.current.cart[0].quantity).toBe(5);
      expect(result.current.cartCount).toBe(5);
    });

    it("should remove an item if quantity is updated to 0", () => {
      // Arrange
      const { result } = renderCartHook();
      act(() => result.current.addToCart(createMockItem({ id: "prod-1" })));
      act(() => result.current.addToCart(createMockItem({ id: "prod-2" })));
      const cartItemIdToRemove = result.current.cart[0].cartItemId;

      // Act
      act(() => result.current.updateQuantity(cartItemIdToRemove, 0));

      // Assert
      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0].id).toBe("prod-2");
      expect(result.current.cartCount).toBe(1);
    });

    it("should remove an item if quantity is updated to a negative number", () => {
      // Arrange
      const { result } = renderCartHook();
      act(() => result.current.addToCart(createMockItem({ id: "prod-1" })));
      const cartItemId = result.current.cart[0].cartItemId;

      // Act
      act(() => result.current.updateQuantity(cartItemId, -1));

      // Assert
      expect(result.current.cart).toHaveLength(0);
      expect(result.current.cartCount).toBe(0);
    });

    it("should clear the entire cart", () => {
      // Arrange
      const { result } = renderCartHook();
      act(() => result.current.addToCart(createMockItem({ id: "prod-1" })));
      act(() => result.current.addToCart(createMockItem({ id: "prod-2" })));

      // Act
      act(() => result.current.clearCart());

      // Assert
      expect(result.current.cart).toHaveLength(0);
      expect(result.current.cartCount).toBe(0);
    });
  });

  // ===========================================================================
  // 5. Custom Hook Behavior
  // ===========================================================================

  describe("useCart Hook", () => {
    it("should throw an error when used outside of CartProvider", () => {
      // Suppress console.error from React's error boundary for this test
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      // Assert
      expect(() => renderHook(() => useCart())).toThrow(
        "useCart debe ser usado dentro de un CartProvider",
      );

      errorSpy.mockRestore();
    });
  });
});