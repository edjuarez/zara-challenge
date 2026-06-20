import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";

export const Navbar = () => {
    const cart = useCart();
    const navigate = useNavigate();
    console.log(cart, "CARRITO DE COMPRA CONTEXT")
    return(
        <section className={styles.navbar}>
            <div className={styles.navbarLogo}
            onClick={() => navigate(`/`)}>
                <img src="/logo.svg" alt="Logo" />
            </div>
            <div className={styles.navbarCartIcon}
             onClick={() => navigate(`/cart`)}>
                <img src="/cart-icon.svg" alt="Cart Icon" />
                <span className={styles.cartCount}> {cart.cartCount}</span>
            </div>
        </section>
    )
}