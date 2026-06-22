import { useCart } from "../../hooks/useCart";
import styles from "./CartItemCard.module.scss";

export const CartItemCard = ({ product }: { product: any }) => {
    const { removeFromCart } = useCart();
    return(
        <div className={styles.cartItemCard}>
            <div className={styles.imageWrapper}>
                <img src={product.imageUrl} alt="Cart Icon" />
            </div>
            <div>
                <p>{product.name}</p>
                <p>{product.selectedStorage} | {product.selectedColor}</p>
                <p>Quantity: {product.quantity}</p>
                <button 
                className={styles.removeBtn}
                onClick={() => removeFromCart(product.cartItemId)}>
                    Remove
                </button>
            </div>
        </div>
    )
}