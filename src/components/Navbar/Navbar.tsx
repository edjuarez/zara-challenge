import { useCart } from "../../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";

export const Navbar = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isCartPage = location.pathname === "/cart";

  return (
    <section className={styles.navbar}>
      <div className={styles.navbarLogo} onClick={() => navigate(`/`)}>
        <img src="/logo.svg" alt="Logo" />
      </div>
      {!isCartPage && (
        <div
          className={styles.navbarCartIcon}
          onClick={() => navigate(`/cart`)}
        >
          <img
            className={styles.cartLogo}
            src={cartCount > 0 ? "/cart-icon-filled.svg" : "/cart-icon.svg"}
            alt="Cart Icon"
          />
          <span className={styles.cartCount}> {cartCount}</span>
        </div>
      )}
    </section>
  );
};
