import { useEffect, useState } from "react";
import { getProducts, Product } from "../../services/api";
import {ProductCard} from "../../components/ProductCard/ProductCard";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
      getProducts()
        .then((data) => {
          console.log("DATOS DE LA API RECIBIDOS:", data);
          setProducts(data);
        })
        .catch((error) => {
          console.error("ERROR AL LLAMAR LA API:", error);
        });
    }, []); 

  return (
  <div className={styles.homePageContainer}>
    <section className={styles.homePage}>
      <h1>Zara Challenge</h1>
      <div className={styles.productsGrid}>
        {products.map((product) => (
        <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  </div>

  );
}