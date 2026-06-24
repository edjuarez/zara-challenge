import { CartItemCard } from "../../components/CartItemCard/CartItemCard";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import styles from "./CartPage.module.scss";

export default function CartPage(){
    const { cart, cartCount } = useCart();
    const totalPrice = cart.reduce((total, product) => total + (product.price || 0), 0);
    const navigate = useNavigate();
    console.log(cart, "sdj")
    return(
        <>
            <section>
                <header>
                    <h1 className={styles.cartTitle}>Cart ({cartCount})</h1>
                </header>
                
                <div className={styles.cartItemsList}>
                    {cart.map(item => (
                        <CartItemCard 
                        key={item.cartItemId}
                        product={item}/>
                    ))}
                </div>
                <footer className={styles.cartFooter}>
                    <button className={styles.continueBtn} onClick={() => navigate("/")}>
                        CONTINUE SHOPPING
                    </button>
                    <div className={styles.rightGroup}>
                        <div className={styles.totalInfo}>
                            <span className={styles.totalLabel}>TOTAL</span>
                            <span className={styles.totalAmount}>{totalPrice} EUR</span>
                        </div>
                        <button className={styles.payBtn}
                        onClick={() => alert(`Compra de ${cartCount} items realizada con éxito!`)}>PAY</button>
                    </div>
                </footer>
            </section>
        </>
    )
}