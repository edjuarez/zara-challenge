import { CartItemCard } from "../../components/CartItemCard/CartItemCard";
import { useCart } from "../../context/CartContext";
import styles from "./CartPage.module.scss";

export default function CartPage(){
    const { cart, removeFromCart } = useCart();
    const totalPrice = cart.reduce((total, product) => total + (product.price || 0), 0);
    console.log(cart, "sdj")
    return(
        <>
            <section>
                <header>
                    <h1>Cart</h1>
                </header>
                
                <div className={styles.cartItemsList}>
                    {cart.map(item => (
                        <CartItemCard 
                        key={item.cartItemId}
                        product={item} />
                    ))}
                </div>
                <footer className={styles.cartFooter}>
                    <button>CONTINUE SHOPPING</button>
                    <div className={styles.totalInfo}>
                        <span>TOTAL</span>
                        <span>{totalPrice} EUR</span>
                    </div>
                    <button className={styles.payBtn}>PAY</button>
                </footer>
            </section>
        </>
    )
}