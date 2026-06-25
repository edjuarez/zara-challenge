import { useEffect, useRef, useState, useCallback } from "react";
import { getProducts, Product } from "../../services/api";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import styles from "./HomePage.module.scss";
import { SearchBar } from "../../components/Searchbar/Searchbar";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const effectRan = useRef(false);
  const [visibleCount, setVisibleCount] = useState(20);

  const deduplicateProducts = (rawProducts: Product[]): Product[] => {
    const seenIds = new Set();
    return rawProducts.filter((product) => {
      if (seenIds.has(product.id)) {
        return false;
      }
      seenIds.add(product.id);
      return true;
    });
  };

  useEffect(() => {
    if (effectRan.current) return;

    getProducts()
      .then((data) => {
        const cleanProducts = deduplicateProducts(data);
        setProducts(cleanProducts);
      })
      .catch((error) => {
        console.error("ERROR AL LLAMAR LA API:", error);
      });

    return () => {
      effectRan.current = true;
    };
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    getProducts(query)
      .then((data) => {
        setProducts(deduplicateProducts(data));
      })
      .catch((error) => {
        console.error("ERROR AL LLAMAR LA API:", error);
      });
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  return (
    <>
      <div className={styles.stickySearchWrapper}>
        <SearchBar
          onSearch={handleSearch}
          resultCount={products.slice(0, visibleCount).length}
        />
      </div>
      <section className={styles.homePage} aria-label="Catálogo de productos">
        <div className={styles.productsGrid}>
          {products.length > 0 ? (
            products
              .slice(0, visibleCount)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
          ) : (
            <p role="status">No se encontraron resultados.</p>
          )}
        </div>

        {visibleCount < products.length && (
          <div className={styles.loadMoreContainer}>
            <button className={styles.loadMoreButton} onClick={handleShowMore}>
              VER MÁS
            </button>
          </div>
        )}
      </section>
    </>
  );
}
