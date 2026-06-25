import { useCart, CartItem } from "../../context/CartContext";
import styles from "./CartItemCard.module.scss";

interface CartItemCardProps {
  product: CartItem;
}

export const CartItemCard = ({ product }: CartItemCardProps) => {
  const { removeFromCart, updateQuantity } = useCart();
  const itemSubtotal = product.price * product.quantity;
  const handleDecrease = () => {
    if (product.quantity > 1) {
      updateQuantity(product.cartItemId, product.quantity - 1);
    } else {
      return;
    }
  };

  const handleIncrease = () => {
    if (product.quantity < 10) {
      updateQuantity(product.cartItemId, product.quantity + 1);
    } else {
      return;
    }
  };
  const secureImageUrl = product.imageUrl.replace(/^http:\/\//i, 'https://');
  return (
    <div className={styles.cartItemCard}>
      <div className={styles.imageWrapper}>
        <img
          src={secureImageUrl}
          alt={`Imagen de ${product.name}, ${product.selectedColor}`}
        />
      </div>

      <div className={styles.cartProductInfo}>
        <p aria-label={`Marca: ${product.brand}`}>{product.name}</p>
        <p
          aria-label={`Especificaciones: ${product.selectedStorage} de almacenamiento, color ${product.selectedColor}`}
        >
          {product.selectedStorage} | {product.selectedColor}
        </p>
        <p aria-label={`Precio: ${itemSubtotal} EUR`}>{itemSubtotal} EUR</p>

        <div className={styles.quantityContainer}>
          <div className={styles.quantitySelector}>
            <button
              type="button"
              className={styles.qtyBtn}
              onClick={handleDecrease}
              aria-label={`Restar una unidad de ${product.name}`}
            >
              -
            </button>

            <span
              className={styles.qtyNumber}
              aria-live="polite"
              aria-atomic="true"
              aria-labelledby={`qty-label-${product.cartItemId}`}
            >
              {product.quantity}
            </span>

            <button
              type="button"
              className={styles.qtyBtn}
              onClick={handleIncrease}
              aria-label={`Sumar una unidad de ${product.name}`}
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          className={styles.removeBtn}
          onClick={() => removeFromCart(product.cartItemId)}
          aria-label={`Eliminar ${product.name} del carrito`}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
