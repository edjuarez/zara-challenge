// components/SimilarItems/SimilarItems.tsx
import { useEffect, useState } from 'react';
import { getProducts, Product } from '../../services/api';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './SimilarItems.module.scss';

interface SimilarItemsProps {
  currentProductId: string;
}

export const SimilarItems = ({ currentProductId }: SimilarItemsProps) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((allProducts) => {
        // Filtrar el producto actual
        const filtered = allProducts.filter((p) => p.id !== currentProductId);

        setSimilarProducts(filtered.slice(0, 8));
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [currentProductId]);

  if (isLoading || similarProducts.length === 0) return null;

  return (
    <section className={styles.similarItemsSection}>
      <h3 className={styles.title}>SIMILAR ITEMS</h3>
      <div className={styles.carouselContainer}>
        <div className={styles.carouselTrack}>
          {similarProducts.map((product) => (
            <div key={product.id} className={styles.carouselItem}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};