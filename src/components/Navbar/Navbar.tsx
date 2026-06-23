import { useCart } from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";

export const Navbar = () => {
    const cart = useCart();
    const navigate = useNavigate();

    return(
        <section className={styles.navbar}>
            <div className={styles.navbarLogo}
                onClick={() => navigate(`/`)}>
                <img src="/logo.svg" alt="Logo" />
            </div>
            <button className={styles.emptyCartBtn}
            onClick={() => cart.clearCart()}>
                Empty Cart
            </button>
            <div className={styles.navbarCartIcon}
            onClick={() => navigate(`/cart`)}>
                <img className={styles.cartLogo} src={cart.cartCount > 0 ? "/cart-icon-filled.svg" : "/cart-icon.svg"} alt="Cart Icon" />
                <span className={styles.cartCount}> {cart.cart.length}</span>
            </div>
        </section>
    )
}