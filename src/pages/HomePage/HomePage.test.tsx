import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import HomePage from "./HomePage";
import { getProducts, Product } from "../../services/api";

// ===========================================================================
// 1. Mocks and Test Setup
// ===========================================================================

// Mock the API service
vi.mock("../../services/api", () => ({
  getProducts: vi.fn(),
}));
const mockedGetProducts = vi.mocked(getProducts);

// Mock child components to isolate HomePage logic
vi.mock("../../components/Searchbar/Searchbar", () => ({
  // The mock captures the onSearch prop to allow us to trigger it in tests
  SearchBar: vi.fn(({ onSearch, resultCount }) => (
    <div>
      <input
        type="text"
        aria-label="Search"
        onChange={(e) => onSearch(e.target.value)}
      />
      <span data-testid="result-count">{resultCount}</span>
    </div>
  )),
}));

vi.mock("../../components/ProductCard/ProductCard", () => ({
  ProductCard: vi.fn(({ product }) => <div>{product.name}</div>),
}));

const createMockProduct = (id: string, name: string): Product => ({
  id,
  name,
  brand: "TestBrand",
  basePrice: 100,
  imageUrl: `http://example.com/${id}.jpg`,
  colorOptions: [],
  storageOptions: [],
});

describe("HomePage Component", () => {
  // Spy on console.error to verify it's called on API failure
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    // Reset mocks before each test to ensure isolation
    vi.clearAllMocks();
  });

  // ===========================================================================
  // 2. Initial Render and Data Loading
  // ===========================================================================
  describe("Initial Render", () => {
    it("should call getProducts on mount and display the returned products", async () => {
      // Arrange: Mock a successful API response with two products.
      const mockProducts = [
        createMockProduct("1", "iPhone 15"),
        createMockProduct("2", "Samsung Galaxy S24"),
      ];
      mockedGetProducts.mockResolvedValue(mockProducts);

      // Act: Render the component.
      render(<HomePage />);

      // Assert: Verify that getProducts was called and products are visible.
      expect(mockedGetProducts).toHaveBeenCalledTimes(1);
      expect(mockedGetProducts).toHaveBeenCalledWith(); // Called with no arguments

      // Use findByText to wait for async rendering
      expect(await screen.findByText("iPhone 15")).toBeInTheDocument();
      expect(await screen.findByText("Samsung Galaxy S24")).toBeInTheDocument();
    });

    it("should filter out duplicate products based on ID", async () => {
      // Arrange: Mock an API response containing duplicate products.
      const mockProducts = [
        createMockProduct("1", "Unique Phone"),
        createMockProduct("2", "Duplicate Phone"),
        createMockProduct("2", "Duplicate Phone"), // Duplicate ID
      ];
      mockedGetProducts.mockResolvedValue(mockProducts);

      // Act
      render(<HomePage />);

      // Assert: Ensure only unique products are rendered.
      expect(await screen.findByText("Unique Phone")).toBeInTheDocument();
      // `findAllByText` will throw if it doesn't find exactly one match.
      expect(await screen.findAllByText("Duplicate Phone")).toHaveLength(1);
    });

    it('should display "No se encontraron resultados." when API returns an empty array', async () => {
      // Arrange: Mock an empty response.
      mockedGetProducts.mockResolvedValue([]);

      // Act
      render(<HomePage />);

      // Assert: Check for the empty state message.
      const emptyStateMessage = await screen.findByText("No se encontraron resultados.");
      expect(emptyStateMessage).toBeInTheDocument();
      expect(emptyStateMessage).toHaveAttribute("role", "status");
    });

    it("should log an error if the initial API call fails", async () => {
      // Arrange: Mock a rejected API call.
      const apiError = new Error("API is down");
      mockedGetProducts.mockRejectedValue(apiError);

      // Act
      render(<HomePage />);

      // Assert: Wait for the error to be logged.
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("ERROR AL LLAMAR LA API:", apiError);
      });
    });
  });

  // ===========================================================================
  // 3. Search Functionality
  // ===========================================================================
  describe("Search Functionality", () => {
    it("should call getProducts with the query when user searches", async () => {
      // Arrange: Set up initial state and mock search results.
      mockedGetProducts.mockResolvedValue([createMockProduct("1", "Initial Product")]);
      const searchResults = [createMockProduct("2", "Searched Product")];

      render(<HomePage />);
      await screen.findByText("Initial Product"); // Wait for initial render

      // Reset mock for the next call
      mockedGetProducts.mockResolvedValue(searchResults);

      // Act: Simulate a user typing in the search bar.
      const searchInput = screen.getByLabelText("Search");
      fireEvent.change(searchInput, { target: { value: "samsung" } });

      // Assert: Verify the API was called with the search term and UI updated.
      await waitFor(() => {
        expect(mockedGetProducts).toHaveBeenCalledWith("samsung");
      });
      expect(await screen.findByText("Searched Product")).toBeInTheDocument();
      expect(screen.queryByText("Initial Product")).not.toBeInTheDocument();
    });

    it("should pass the correct result count to the SearchBar", async () => {
        // Arrange: 25 products to test pagination count
        const mockProducts = Array.from({ length: 25 }, (_, i) => createMockProduct(`${i}`, `Product ${i}`));
        mockedGetProducts.mockResolvedValue(mockProducts);

        // Act
        render(<HomePage />);

        // Assert: Initially, count should be 20 (the visible count).
        await waitFor(() => {
            expect(screen.getByTestId('result-count')).toHaveTextContent('20');
        });

        // Act: Click "Load More"
        const loadMoreButton = screen.getByRole('button', { name: /ver más/i });
        fireEvent.click(loadMoreButton);

        // Assert: The count should update to 25.
        await waitFor(() => {
            expect(screen.getByTestId('result-count')).toHaveTextContent('25');
        });
    });
  });

  // ===========================================================================
  // 4. "Load More" Pagination
  // ===========================================================================
  describe("Load More Functionality", () => {
    it('should show "VER MÁS" button if there are more than 20 products', async () => {
      // Arrange: Mock 21 products.
      const mockProducts = Array.from({ length: 21 }, (_, i) => createMockProduct(`${i}`, `Product ${i}`));
      mockedGetProducts.mockResolvedValue(mockProducts);

      render(<HomePage />);

      // Assert: The button should be visible.
      expect(await screen.findByRole("button", { name: /ver más/i })).toBeInTheDocument();
    });

    it('should NOT show "VER MÁS" button if there are 20 or fewer products', async () => {
      // Arrange: Mock 20 products.
      const mockProducts = Array.from({ length: 20 }, (_, i) => createMockProduct(`${i}`, `Product ${i}`));
      mockedGetProducts.mockResolvedValue(mockProducts);

      render(<HomePage />);

      // Assert: Wait for products to render, then check that the button is absent.
      await screen.findByText("Product 19");
      expect(screen.queryByRole("button", { name: /ver más/i })).not.toBeInTheDocument();
    });

    it("should display more products when 'VER MÁS' is clicked", async () => {
      // Arrange: Mock 21 products.
      const mockProducts = Array.from({ length: 21 }, (_, i) => createMockProduct(`${i}`, `Product ${i}`));
      mockedGetProducts.mockResolvedValue(mockProducts);

      render(<HomePage />);

      // Assert: Initially, only the first 20 products are visible.
      await screen.findByText("Product 19");
      expect(screen.queryByText("Product 20")).not.toBeInTheDocument();

      // Click the "Load More" button.
      const loadMoreButton = await screen.findByRole("button", { name: /ver más/i });
      fireEvent.click(loadMoreButton);

      // Assert: The 21st product is now visible.
      expect(await screen.findByText("Product 20")).toBeInTheDocument();
    });

    it("should hide the 'VER MÁS' button when all products are visible", async () => {
      // Arrange: Mock 21 products.
      const mockProducts = Array.from({ length: 21 }, (_, i) => createMockProduct(`${i}`, `Product ${i}`));
      mockedGetProducts.mockResolvedValue(mockProducts);

      render(<HomePage />);

      // Click the button.
      const loadMoreButton = await screen.findByRole("button", { name: /ver más/i });
      fireEvent.click(loadMoreButton);

      // Assert: Wait for the new product to appear, then check that the button is gone.
      await screen.findByText("Product 20");
      expect(screen.queryByRole("button", { name: /ver más/i })).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // 5. Accessibility
  // ===========================================================================
  describe("Accessibility", () => {
    it("should have a main section with an accessible name for the product catalog", async () => {
      mockedGetProducts.mockResolvedValue([]);
      
      render(<HomePage />);

      const catalog = await screen.findByRole("region", { name: /catálogo de productos/i });
      expect(catalog).toBeInTheDocument();
    });
  });
});