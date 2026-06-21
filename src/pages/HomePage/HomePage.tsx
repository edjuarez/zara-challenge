import { useEffect, useRef, useState, useCallback } from "react";
import { getProducts, Product } from "../../services/api";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import styles from "./HomePage.module.scss";
import { SearchBar } from "../../components/Searchbar/Searchbar";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const effectRan = useRef(false);

  // 1. Carga inicial del catálogo completo
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

  return (
    <>
      <SearchBar onSearch={handleSearch} resultCount={products.length}/>
      <div className={styles.homePageContainer}>
        <section className={styles.homePage}>
          <div className={styles.productsGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id + Math.random()} product={product} />
              ))
            ) : (
              <p>No se encontraron resultados.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}