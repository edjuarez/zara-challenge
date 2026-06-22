import { CartItemCard } from "../../components/CartItemCard/CartItemCard";
import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import styles from "./CartPage.module.scss";

export default function CartPage(){
    const { cart } = useCart();
    const totalPrice = cart.reduce((total, product) => total + (product.price || 0), 0);
    const navigate = useNavigate();
    console.log(cart, "sdj")
    return(
        <>
            <section>
                <header>
                    <h1>Cart ({cart.length})</h1>
                </header>
                
                <div className={styles.cartItemsList}>
                    {cart.map(item => (
                        <CartItemCard 
                        key={item.cartItemId}
                        product={item}/>
                    ))}
                </div>
                <footer className={styles.cartFooter}>
                    <button
                    onClick={() => navigate("/")}>
                        CONTINUE SHOPPING
                    </button>
                    <div className={styles.totalInfo}>
                        <span>TOTAL</span>
                        <span> {totalPrice} EUR</span>
                    </div>
                    <button className={styles.payBtn}>PAY</button>
                </footer>
            </section>
        </>
    )
}