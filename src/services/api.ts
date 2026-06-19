export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  imgUrl: string;
}

export interface ProductDetail extends Product {
  cpu: string;
  ram: string;
  os: string;
  displayResolution: string;
  battery: string;
  cameras: string;
  internalMemory: string[];
  colors: string[];
}

const BASE_URL = "https://prueba-tecnica-api-tienda-moviles.onrender.com";
const API_KEY = "87909682e6cd74208f41a6ef39fe4191";

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

export const getProducts = async (): Promise<Product[]> => {
  return fetchFromApi("/products");
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