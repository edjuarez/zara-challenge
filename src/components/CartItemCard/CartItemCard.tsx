import styles from "./CartItemCard.module.scss";
export const CartItemCard = ({ product }: { product: any }) => {
    console.log(product, "imagen del producto")
    return(
        <div className={styles.cartItemCard}>
            <img src={product.imageUrl} alt="Cart Icon" />
            <div>
                <p>{product.name}</p>
                <p>{product.selectedStorage} | {product.selectedColor}</p>
                <p>Quantity: {product.quantity}</p>
                <button className={styles.removeBtn}>Remove</button>
            </div>
        </div>
    )
}