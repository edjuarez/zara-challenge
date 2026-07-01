// components/SimilarItems/SimilarItems.tsx
import { useEffect, useState } from "react";
import { getProducts, Product } from "../../services/api";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from "./SimilarItems.module.scss";

interface SimilarItemsProps {
  currentProductId: string;
}

type ProductWithUniqueKey = Product & { uniqueKey: string };

export const SimilarItems = ({ currentProductId }: SimilarItemsProps) => {
  const [similarProducts, setSimilarProducts] = useState<
    ProductWithUniqueKey[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    setIsLoading(true);

    getProducts()
      .then((allProducts) => {
        if (abortController.signal.aborted) return;

        const filtered = allProducts.filter((p) => p.id !== currentProductId);

        const sanitizedProducts: ProductWithUniqueKey[] = filtered.map(
          (product, index) => ({
            ...product,
            uniqueKey: `${product.id}-${index}`,
          }),
        );

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
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
