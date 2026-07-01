import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DetailsPage from "./DetailsPage";
import { getProductById, ProductDetail } from "../../services/api";

// ===========================================================================
// 1. Mocks and Test Setup
// ===========================================================================

const mockNavigate = vi.fn();
const mockAddToCart = vi.fn();

// Mock external dependencies
vi.mock("../../services/api", () => ({
  getProductById: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../context/CartContext", () => ({
  useCart: vi.fn(() => ({
    addToCart: mockAddToCart,
  })),
}));

// Mock child components to prevent testing their implementation details
vi.mock("../../components/ProductSpecifications/ProductSpecifications", () => ({
  ProductSpecifications: vi.fn(() => (
    <div data-testid="product-specifications" />
  )),
}));

vi.mock("../../components/SimilarItems/SimilarItems", () => ({
  SimilarItems: vi.fn(() => <div data-testid="similar-items" />),
}));

const mockedGetProductById = vi.mocked(getProductById);
const mockedUseParams = vi.mocked((await import("react-router-dom")).useParams);

// ===========================================================================
// 2. Reusable Test Data Factory
// ===========================================================================

const createMockProduct = (): ProductDetail => ({
  id: "123",
  brand: "TestBrand",
  name: "SuperPhone Pro",
  basePrice: 1000,
  imageUrl: "default-image.jpg",

  colorOptions: [
    {
      hexCode: "#8A8A83",
      name: "Natural Titanium",
      imageUrl: "titanium-image.jpg",
    },
    {
      hexCode: "#2E3A48",
      name: "Blue Titanium",
      imageUrl: "blue-image.jpg",
    },
  ],

  storageOptions: [
    {
      capacity: "256 GB",
      price: 1000,
    },
    {
      capacity: "512 GB",
      price: 1200,
    },
  ],

  screen: "6.7 inches",
  resolution: "2796 x 1290",
  processor: "A17 Pro",
  mainCamera: "48 MP",
  selfieCamera: "12 MP",
  os: "iOS 17",
  screenRefreshRate: "120 Hz",
  specs: {},

  description: "A premium smartphone.",
  cpu: "A17 Pro",
  ram: "8 GB",
  displayResolution: "2796 x 1290",
  battery: "4422 mAh",
  primaryCamera: "48 MP",
  secondaryCamera: "12 MP",
  dimensions: "159.9 x 76.7 x 8.25 mm",
  weight: "221 g",
  sim: "Dual SIM",
});

// Helper to render the component within a router context
const renderComponent = (productId: string) => {
  mockedUseParams.mockReturnValue({ id: productId });
  return render(
    <MemoryRouter initialEntries={[`/product/${productId}`]}>
      <Routes>
        <Route path="/product/:id" element={<DetailsPage />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("DetailsPage Component", () => {
  const user = userEvent.setup();
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});
  window.scrollTo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // 3. Test Cases
  // ===========================================================================

  describe("Loading and Error States", () => {
    /**
     * Verifies that a loading indicator is shown while the API call is in progress.
     */
    it("should display a loading indicator while fetching data", async () => {
      // Arrange: Mock a promise that hasn't resolved yet
      mockedGetProductById.mockReturnValue(new Promise(() => {}));

      // Act
      renderComponent("123");

      // Assert: The loading spinner should be visible
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    /**
     * Checks that the component handles API failures gracefully by logging an error and showing a user-friendly message.
     */
    it("should handle API rejection gracefully", async () => {
      // Arrange: Mock the API to reject with an error
      const apiError = new Error("Network Error");
      mockedGetProductById.mockRejectedValue(apiError);

      // Act
      renderComponent("123");

      // Assert: An error should be logged to the console
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error cargando producto:",
          apiError,
        );
      });
      // Optional: Assert that an error message is shown to the user
      expect(
        await screen.findByText("Producto no encontrado."),
      ).toBeInTheDocument();
    });
  });

  describe("Product Rendering and Interactions", () => {
    const mockProduct = createMockProduct();

    beforeEach(() => {
      // Arrange: Mock a successful API response for all tests in this block
      mockedGetProductById.mockResolvedValue(mockProduct);
    });

    /**
     * Confirms that after a successful API call, all essential product details, options, and child components are rendered correctly.
     */
    it("should render product details, options, and child components correctly", async () => {
      // Act
      renderComponent("123");

      // Assert: Check for key product information
      expect(await screen.findByText("SuperPhone Pro")).toBeInTheDocument();
      expect(
        screen.getByRole("img", { name: /SuperPhone Pro/i }),
      ).toHaveAttribute("src", "titanium-image.jpg");
      expect(screen.getByText(/From 1000 EUR/i)).toBeInTheDocument();

      // Assert: Check for options
      expect(
        screen.getByRole("button", { name: "256 GB" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "512 GB" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Natural Titanium/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Blue Titanium/i }),
      ).toBeInTheDocument();

      // Assert: Check for child components
      expect(screen.getByTestId("product-specifications")).toBeInTheDocument();
      expect(screen.getByTestId("similar-items")).toBeInTheDocument();
    });

    /**
     * Simulates a user selecting a different storage option and verifies that the displayed price updates accordingly.
     */
    it("should update the price when a different storage option is selected", async () => {
      // Act
      renderComponent("123");
      const storageOption512 = await screen.findByRole("button", {
        name: "512 GB",
      });

      // Assert: Initial price is 1000 EUR
      expect(screen.getByText(/From 1000 EUR/i)).toBeInTheDocument();

      // Act: Select the 512 GB option
      await user.click(storageOption512);

      // Assert: Price updates to 1200 EUR
      expect(await screen.findByText("1200 EUR")).toBeInTheDocument();
      expect(screen.queryByText(/From 1000 EUR/i)).not.toBeInTheDocument();
    });

    /**
     * Simulates a user selecting a color and verifies that the main product image and displayed color name are updated.
     */
    it("should update the image and color name when a color is selected", async () => {
      // Act
      renderComponent("123");
      const colorOptionBlue = await screen.findByRole("button", {
        name: /Blue Titanium/i,
      });
      const productImage = screen.getByRole("img", { name: /SuperPhone Pro/i });

      // Assert: Initial image and no color name text
      expect(productImage).toHaveAttribute("src", "titanium-image.jpg");
      expect(screen.queryByText(/^Blue Titanium$/)).not.toBeInTheDocument();

      // Act: Select the blue color
      await user.click(colorOptionBlue);

      // Assert: Image and color name text are updated
      await waitFor(() => {
        expect(productImage).toHaveAttribute("src", "blue-image.jpg");
      });
      expect(screen.getByText(/^Blue Titanium$/)).toBeInTheDocument();
    });

    /**
     * Validates the core business logic that the "Add to Cart" button is disabled until both a storage and a color option have been selected.
     */
    it('should enable the "AÑADIR" button only when both storage and color are selected', async () => {
      // Act
      renderComponent("123");
      const addButton = await screen.findByRole("button", { name: /añadir/i });
      const storageOption = screen.getByRole("button", { name: "256 GB" });
      const colorOption = screen.getByRole("button", {
        name: /Natural Titanium/i,
      });

      // Assert: Initially disabled
      expect(addButton).toBeDisabled();

      // Act: Select only storage
      await user.click(storageOption);
      // Assert: Still disabled
      expect(addButton).toBeDisabled();

      // Act: Select color as well
      await user.click(colorOption);
      // Assert: Now enabled
      expect(addButton).toBeEnabled();
    });
  });

  describe("Accessibility", () => {
    /**
     * Verifies that selection state is correctly communicated to assistive technologies via the `aria-pressed` attribute.
     */
    it("should toggle aria-pressed state on storage and color options upon selection", async () => {
      // Arrange
      const mockProduct = createMockProduct();
      mockedGetProductById.mockResolvedValue(mockProduct);
      renderComponent("123");

      const storageOption = await screen.findByRole("button", {
        name: "256 GB",
      });
      const colorOption = await screen.findByRole("button", {
        name: "Color Natural Titanium",
      });

      // Assert: Initial state is not pressed
      expect(storageOption).toHaveAttribute("aria-pressed", "false");
      expect(colorOption).toHaveAttribute("aria-pressed", "false");

      // Act: Select storage
      await user.click(storageOption);

      // Assert: Storage is pressed, color is not
      expect(storageOption).toHaveAttribute("aria-pressed", "true");
      expect(colorOption).toHaveAttribute("aria-pressed", "false");

      // Act: Select color
      await user.click(colorOption);

      // Assert: Both are now pressed
      expect(storageOption).toHaveAttribute("aria-pressed", "true");
      expect(colorOption).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("Add to Cart and Navigation", () => {
    /**
     * Tests the complete "add to cart" flow: selecting options, clicking the button, verifying the correct data is sent to the cart context, and confirming navigation.
     */
    it('should call addToCart with the correct payload and navigate to "/cart"', async () => {
      // Arrange
      const mockProduct = createMockProduct();
      mockedGetProductById.mockResolvedValue(mockProduct);
      renderComponent("123");

      const storageOption = await screen.findByRole("button", {
        name: "512 GB",
      }); // 1200 EUR
      const colorOption = await screen.findByRole("button", {
        name: /Blue Titanium/i,
      }); // blue-image.jpg
      const addButton = screen.getByRole("button", { name: /añadir/i });

      // Act: Select options and click add
      await user.click(storageOption);
      await user.click(colorOption);
      await user.click(addButton);

      // Assert: addToCart was called with the correct, fully configured product
      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledTimes(1);
        expect(mockAddToCart).toHaveBeenCalledWith({
          id: mockProduct.id,
          name: mockProduct.name,
          brand: mockProduct.brand,
          price: 1200,
          imageUrl: "blue-image.jpg",
          selectedColor: "Blue Titanium",
          hexCode: "#2E3A48",
          selectedStorage: "512 GB",
        });
      });

      // Assert: Navigation to cart page was triggered
      expect(mockNavigate).toHaveBeenCalledWith("/cart");
    });

    /**
     * Ensures that the "BACK" button correctly triggers navigation back to the home page.
     */
    it('should navigate to "/" when the "BACK" button is clicked', async () => {
      // Arrange
      mockedGetProductById.mockResolvedValue(createMockProduct());
      renderComponent("123");
      const backButton = await screen.findByRole("button", {
        name: /Volver al catálogo principal/i,
      });

      // Act
      await user.click(backButton);

      // Assert
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
