import { useCart } from "../../hooks/useCart";
import styles from "./CartItemCard.module.scss";

export const CartItemCard = ({ product }: { product: any }) => {
    const { removeFromCart } = useCart();
    return(
        <div className={styles.cartItemCard}>
            <div className={styles.imageWrapper}>
                <img src={product.imageUrl} alt="Cart Icon" />
            </div>
            <div className={styles.cartProductInfo}>
                <p>{product.name}</p>
                <p>{product.selectedStorage} | {product.selectedColor}</p>
                <p>{product.price} EUR</p><br></br>
                <p>Cantidad: {product.quantity}</p>
                <button 
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(product.cartItemId)}
                    >
                    Eliminar
                </button>
            </div>
        </div>
    )
}