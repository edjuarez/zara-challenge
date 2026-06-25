// components/SimilarItems/SimilarItems.tsx
import { useEffect, useState } from "react";
import { getProducts, Product } from "../../services/api";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from "./SimilarItems.module.scss";

interface SimilarItemsProps {
  currentProductId: string;
}

// Extendemos el tipo localmente para asegurar que TypeScript reconozca nuestra llave única
type ProductWithUniqueKey = Product & { uniqueKey: string };

export const SimilarItems = ({ currentProductId }: SimilarItemsProps) => {
  const [similarProducts, setSimilarProducts] = useState<
    ProductWithUniqueKey[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Instanciamos el controlador para poder abortar la petición si el ID cambia
    const abortController = new AbortController();

    setIsLoading(true);

    getProducts()
      .then((allProducts) => {
        // Si la petición fue abortada en el camino, no hacemos nada
        if (abortController.signal.aborted) return;

        // 2. Filtramos el producto actual
        const filtered = allProducts.filter((p) => p.id !== currentProductId);

        // 3. Sanitizamos los datos inyectando un índice único para matar la duplicación en el DOM
        const sanitizedProducts: ProductWithUniqueKey[] = filtered.map(
          (product, index) => ({
            ...product,
            uniqueKey: `${product.id}-${index}`, // Llave 100% única y estable
          }),
        );

        // Limitamos a los primeros 8
        setSimilarProducts(sanitizedProducts.slice(0, 8));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error cargando productos similares:", err);
        }
      })
      .finally(() => {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      });

    // 4. FUNCIÓN DE LIMPIEZA (Cleanup): Se ejecuta cuando el currentProductId cambia
    return () => {
      abortController.abort();
    };
  }, [currentProductId]);

  if (isLoading || similarProducts.length === 0) return null;

  return (
    <section className={styles.similarItemsSection}>
      <h3 className={styles.title}>SIMILAR ITEMS</h3>
      <div className={styles.carouselContainer}>
        <div className={styles.carouselTrack}>
          {similarProducts.map((product) => (
            <div key={product.uniqueKey} className={styles.carouselItem}>
              {" "}
              {/* Usamos uniqueKey */}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
