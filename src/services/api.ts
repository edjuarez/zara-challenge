import { ColorOption, StorageOption } from "../pages/DetailsPage/DetailsPage";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export interface Product {
  id: string;
  brand: string;
  name: string;
  basePrice: number;
  imageUrl: string;
  colorOptions: ColorOption[];
  storageOptions: StorageOption[];
  uniqueKey?: string;
}

export interface ProductDetail extends Product {
  screen: string;
  resolution: string;
  processor: string;
  mainCamera: string;
  selfieCamera: string;
  os: string;
  screenRefreshRate: string;
  specs: Object;
}

const fetchFromApi = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getProducts = async (searchTerm?: string): Promise<Product[]> => {
  const endpoint = searchTerm 
    ? `/products?search=${encodeURIComponent(searchTerm)}` 
    : "/products";
  return fetchFromApi(endpoint);
};

export const getProductById = async (id: string): Promise<ProductDetail> => {
  return fetchFromApi(`/products/${id}`);
};

export const addToCartApi = async (productId: string, color: string, storage: string): Promise<{ count: number }> => {
  return fetchFromApi("/cart", {
    method: "POST",
    body: JSON.stringify({ id: productId, color, storage }),
  });
};