import { useCart, CartItem } from "../../context/CartContext";
import styles from "./CartItemCard.module.scss";

interface CartItemCardProps {
  product: CartItem;
}

export const CartItemCard = ({ product }: CartItemCardProps) => {
  const { removeFromCart } = useCart();
  return (
    <div className={styles.cartItemCard}>
      <div className={styles.imageWrapper}>
        <img
          src={product.imageUrl}
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
        <p aria-label={`Precio: ${product.price} EUR`}>{product.price} EUR</p>
        <br></br>
        <p aria-label={`Cantidad: ${product.quantity}`}>
          Cantidad: {product.quantity}
        </p>
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
