import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CartPage from "./CartPage";
import { useCart, CartItem } from "../../context/CartContext";

// ===========================================================================
// 1. Mocks and Test Setup
// ===========================================================================

// Mock the useCart hook from CartContext
vi.mock("../../context/CartContext", () => ({
  useCart: vi.fn(),
}));
const mockedUseCart = vi.mocked(useCart);

// Mock the CartItemCard child component
vi.mock("../../components/CartItemCard/CartItemCard", () => ({
  CartItemCard: vi.fn(({ product }) => (
    <div data-testid="cart-item">{product.name}</div>
  )),
}));
const mockedCartItemCard = vi.mocked(
  (await import("../../components/CartItemCard/CartItemCard")).CartItemCard,
);

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper to create mock cart item data
const createMockCartItem = (
  id: string,
  name: string,
  price?: number,
): Omit<CartItem, "price"> & { price: number } => ({
  cartItemId: `cart-${id}`,
  id,
  name,
  brand: "TestBrand",
  price: price ?? 100,
  imageUrl: "test.jpg",
  selectedColor: "Blue",
  hexCode: "#0000FF",
  selectedStorage: "128 GB",
  quantity: 1,
});

// Helper to render the component within necessary providers
const renderCartPage = () => {
  return render(
    <MemoryRouter>
      <CartPage />
    </MemoryRouter>,
  );
};

describe("CartPage Component", () => {
  const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // 2. Empty Cart State
  // ===========================================================================
  describe("when the cart is empty", () => {
    beforeEach(() => {
      // Arrange: Mock an empty cart state incluyendo la nueva función del contrato
      mockedUseCart.mockReturnValue({
        cart: [],
        cartCount: 0,
        addToCart: vi.fn(),
        clearCart: vi.fn(),
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(), // <--- AÑADIDO
      });
    });

    it("should display the title with a count of 0", () => {
      renderCartPage();
      expect(
        screen.getByRole("heading", { name: /cart \(0\)/i }),
      ).toBeInTheDocument();
    });

    it("should display a total price of 0 EUR", () => {
      renderCartPage();
      expect(screen.getByText("0 EUR")).toBeInTheDocument();
    });

    it("should not render any CartItemCard components", () => {
      renderCartPage();
      expect(screen.queryByTestId("cart-item")).not.toBeInTheDocument();
      expect(mockedCartItemCard).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // 3. Cart with Items
  // ===========================================================================
  describe("when the cart has items", () => {
    const mockItems = [
      createMockCartItem("1", "iPhone 15", 1000),
      createMockCartItem("2", "Galaxy S24", 800),
    ];

    beforeEach(() => {
      // Arrange: Mock de un carrito con items y la función updateQuantity
      mockedUseCart.mockReturnValue({
        cart: mockItems,
        cartCount: 2,
        addToCart: vi.fn(),
        clearCart: vi.fn(),
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(), // <--- AÑADIDO
      });
    });

    it("should display the correct title and item count", () => {
      renderCartPage();
      expect(
        screen.getByRole("heading", { name: /cart \(2\)/i }),
      ).toBeInTheDocument();
    });

    it("should render a CartItemCard for each item in the cart", () => {
      renderCartPage();
      const renderedItems = screen.getAllByTestId("cart-item");
      expect(renderedItems).toHaveLength(2);
      expect(renderedItems[0]).toHaveTextContent("iPhone 15");
      expect(renderedItems[1]).toHaveTextContent("Galaxy S24");
      expect(mockedCartItemCard).toHaveBeenCalledTimes(2);
      expect(mockedCartItemCard).toHaveBeenCalledWith(
        { product: mockItems[0] },
        {},
      );
    });

    it("should calculate and display the correct total price", () => {
      renderCartPage();
      expect(screen.getByText("1800 EUR")).toBeInTheDocument();
    });

    it("should treat items with an undefined price as 0 in the total calculation", () => {
      const itemsWithUndefinedPrice: CartItem[] = [
        {
          cartItemId: "cart-1",
          id: "1",
          name: "Priced Item",
          brand: "TestBrand",
          price: 500,
          imageUrl: "test.jpg",
          selectedColor: "Blue",
          hexCode: "#0000FF",
          selectedStorage: "128 GB",
          quantity: 1,
        },
        {
          ...createMockCartItem("2", "Priceless Item"),
          price: undefined as unknown as number, // More type-safe way to handle this for testing
        },
      ];

      mockedUseCart.mockReturnValue({
        ...mockedUseCart.getMockImplementation()!(),
        cart: itemsWithUndefinedPrice,
        cartCount: 2,
      });

      renderCartPage();
      expect(screen.getByText("500 EUR")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // 4. User Interactions
  // ===========================================================================
  describe("User Interactions", () => {
    it('should navigate to "/" when "CONTINUE SHOPPING" is clicked', async () => {
      const user = userEvent.setup();
      mockedUseCart.mockReturnValue({
        cart: [],
        cartCount: 0,
        addToCart: vi.fn(),
        clearCart: vi.fn(),
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(), // <--- AÑADIDO
      });
      renderCartPage();
      const continueButton = screen.getByRole("button", {
        name: /continue shopping/i,
      });

      await user.click(continueButton);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it('should trigger an alert with the correct item count when "PAY" is clicked', async () => {
      const user = userEvent.setup();
      mockedUseCart.mockReturnValue({
        cart: [createMockCartItem("1", "Item")],
        cartCount: 1,
        addToCart: vi.fn(),
        clearCart: vi.fn(),
        removeFromCart: vi.fn(),
        updateQuantity: vi.fn(), // <--- AÑADIDO
      });
      renderCartPage();
      const payButton = screen.getByRole("button", { name: /pay/i });

      await user.click(payButton);
      expect(alertSpy).toHaveBeenCalledWith("Purchase of 1 item completed");
    });
  });
});
