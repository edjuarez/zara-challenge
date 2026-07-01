import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getProducts, getProductById, addToCartApi } from "./api";

const MOCK_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MOCK_API_KEY = import.meta.env.VITE_API_KEY;

vi.stubEnv("VITE_API_BASE_URL", MOCK_BASE_URL);
vi.stubEnv("VITE_API_KEY", MOCK_API_KEY);

globalThis.fetch = vi.fn();
const mockedFetch = vi.mocked(fetch);

describe("API Service Suite", () => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    "x-api-key": MOCK_API_KEY,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // ===========================================================================
  // 1. getProducts()
  // ===========================================================================
  describe("getProducts()", () => {
    it("Success: Returns products list successfully", async () => {
      // Arrange
      const mockProducts = [
        { id: "1", name: "Phone A" },
        { id: "2", name: "Phone B" },
      ];
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      } as Response);

      // Act
      const result = await getProducts();

      // Assert
      expect(result).toEqual(mockProducts);
      expect(mockedFetch).toHaveBeenCalledTimes(1);
      expect(mockedFetch).toHaveBeenCalledWith(`${MOCK_BASE_URL}/products`, {
        headers: defaultHeaders,
      });
    });

    it("Search: Appends search query correctly when a basic term is provided", async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);
      const searchTerm = "samsung";

      // Act
      await getProducts(searchTerm);

      // Assert
      expect(mockedFetch).toHaveBeenCalledWith(
        `${MOCK_BASE_URL}/products?search=samsung`,
        {
          headers: defaultHeaders,
        },
      );
    });

    it("Search: Uses encodeURIComponent for special characters and spaces", async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);
      const searchTerm = "iphone 15 pro & max";
      const encodedTerm = encodeURIComponent(searchTerm); // "iphone%2015%20pro%20%26%20max"

      // Act
      await getProducts(searchTerm);

      // Assert
      expect(mockedFetch).toHaveBeenCalledWith(
        `${MOCK_BASE_URL}/products?search=${encodedTerm}`,
        {
          headers: defaultHeaders,
        },
      );
    });

    it("Error: Throws descriptive error when response.ok is false", async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      // Act & Assert
      await expect(getProducts()).rejects.toThrow(
        "Error en la petición: 500 Internal Server Error",
      );
    });
  });

  // ===========================================================================
  // 2. getProductById()
  // ===========================================================================
  describe("getProductById()", () => {
    it("Success: Calls correct endpoint and returns product detail", async () => {
      // Arrange
      const mockProductDetail = { id: "p-123", name: "Test Phone", specs: {} };
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProductDetail,
      } as Response);

      // Act
      const result = await getProductById("p-123");

      // Assert
      expect(result).toEqual(mockProductDetail);
      expect(mockedFetch).toHaveBeenCalledWith(
        `${MOCK_BASE_URL}/products/p-123`,
        {
          headers: defaultHeaders,
        },
      );
    });

    it("Error: Handles HTTP errors properly and throws descriptive error", async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as Response);

      // Act & Assert
      await expect(getProductById("unknown-id")).rejects.toThrow(
        "Error en la petición: 404 Not Found",
      );
    });
  });

  // ===========================================================================
  // 3. addToCartApi()
  // ===========================================================================
  describe("addToCartApi()", () => {
    it("Success: Uses POST method, calls /cart, and sends correct body/headers", async () => {
      // Arrange
      const mockResponse = { count: 1 };
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const productId = "p-1";
      const color = "Space Black";
      const storage = "256GB";

      // Act
      const result = await addToCartApi(productId, color, storage);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockedFetch).toHaveBeenCalledWith(`${MOCK_BASE_URL}/cart`, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify({ id: productId, color, storage }),
      });
    });

    it("Error: Throws error when API returns non-success response on POST", async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      } as Response);

      // Act & Assert
      await expect(addToCartApi("1", "Red", "128GB")).rejects.toThrow(
        "Error en la petición: 400 Bad Request",
      );
    });
  });

  // ===========================================================================
  // 4. Edge Cases
  // ===========================================================================
  describe("Edge Cases", () => {
    it("Empty search string: Falls back to the base /products endpoint", async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      // Act
      await getProducts(""); // Empty string evaluates to falsy

      // Assert
      expect(mockedFetch).toHaveBeenCalledWith(`${MOCK_BASE_URL}/products`, {
        headers: defaultHeaders,
      });
    });

    it("Product id containing special characters: Appends correctly to the URL", async () => {
      // Arrange
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);
      const trickyId = "prod@123/v2";

      // Act
      await getProductById(trickyId);

      // Assert
      // Note: The implementation strictly does `${BASE_URL}/products/${id}` without URI encoding.
      expect(mockedFetch).toHaveBeenCalledWith(
        `${MOCK_BASE_URL}/products/prod@123/v2`,
        {
          headers: defaultHeaders,
        },
      );
    });

    it("Network failure: Rejects gracefully when fetch throws a network exception", async () => {
      // Arrange
      const networkError = new TypeError("Failed to fetch");
      mockedFetch.mockRejectedValueOnce(networkError);

      // Act & Assert
      await expect(getProducts()).rejects.toThrow("Failed to fetch");
    });
  });
});
