import styles from "./ProductCard.module.scss";
import { useNavigate } from "react-router-dom";
export const ProductCard = ({ product }: { product: any }) => {
    const navigate = useNavigate();
    return(
        <article className={styles.productCard}
        onClick={() => navigate(`/product/${product.id}`)}>
        <div className={styles.imageWrapper}>
            <img src={product.imageUrl} alt={`${product.brand} ${product.model}`} />

        </div>
        <div className={styles.productInfo}>
            <div className={styles.details}>
            <span className={styles.brand}>{product.brand}</span>
            <span className={styles.model}>{product.name}</span>
            </div>
            <div className={styles.price}>
            {product.basePrice ? `${product.basePrice} €` : "Consultar precio"}
            </div>
        </div>
        </article>
    )
}