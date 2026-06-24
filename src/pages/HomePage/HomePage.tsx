import { useEffect, useRef, useState, useCallback } from "react";
import { getProducts, Product } from "../../services/api";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import styles from "./HomePage.module.scss";
import { SearchBar } from "../../components/Searchbar/Searchbar";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const effectRan = useRef(false);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    if (effectRan.current) return;
    
    getProducts()
      .then((data) => {
        setProducts(data);
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
        console.log(data, "API SEARCH DATA")
        setProducts(data);
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
      <section className={styles.homePage}>
        <div className={styles.productsGrid}>
          {products.length > 0 ? (
            products.slice(0, visibleCount).map((product) => (
              <ProductCard key={product.id + Math.random()} product={product} />
            ))
          ) : (
            <p>No se encontraron resultados.</p>
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