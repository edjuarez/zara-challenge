import styles from "./ProductCard.module.scss";
import { Link } from "react-router-dom";
import { Product } from "../../services/api";

export const ProductCard = ({ product }: { product: Product }) => {
  const productLabel = `${product.brand} ${product.name}. ${
    product.basePrice ? `${product.basePrice} EUR` : "Consultar precio"
  }`;

  return (
    <article className={styles.productCard}>
      <Link
        to={`/product/${product.id}`}
        className={styles.cardLink}
        aria-label={productLabel}
      >
        <div className={styles.imageWrapper}>
          <img src={product.imageUrl} alt="" aria-hidden="true" />
        </div>
        <div className={styles.productInfo}>
          <div className={styles.details}>
            <span
              className={styles.brand}
              aria-label={`Marca: ${product.brand}`}
            >
              {product.brand}
            </span>
            <span
              className={styles.model}
              aria-label={`Modelo: ${product.name}`}
            >
              {product.name}
            </span>
          </div>
          <div
            className={styles.price}
            aria-label={`Precio: ${product.basePrice ? `${product.basePrice} EUR` : "Consultar precio"}`}
          >
            {product.basePrice
              ? `${product.basePrice} EUR`
              : "Consultar precio"}
          </div>
        </div>
      </Link>
    </article>
  );
};
