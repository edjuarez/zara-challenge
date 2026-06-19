// src/pages/DetailPage/DetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, ProductDetail } from "../../services/api";
import { useCart } from "../../context/CartContext";
import styles from "./DetailsPage.module.scss";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStorageIndex, setSelectedStorageIndex] = useState<number>(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then((data) => {
            setProduct(data)
            console.log(data)
        })
        .catch((error) => console.error("Error cargando producto:", error))
        .finally(() => setIsLoading(false));
    }
  }, [id]);
  if (isLoading) return <div style={{ padding: "4rem", textAlign: "center", fontSize: "0.8rem", textTransform: "uppercase" }}>Cargando especificaciones...</div>;
  if (!product) return <div style={{ padding: "4rem", textAlign: "center" }}>Producto no encontrado.</div>;

  const currentImageUrl = product.colorOptions[selectedColorIndex].imageUrl;

  function handleAddToCart() {

  }

  return (
    <div className={styles.homePageContainer}>
        <header className={styles.pageHeader}>
            <button className={styles.backButton} onClick={() => navigate("/")}>
                ← BACK
            </button>
        </header>
        <section className={styles.mainProductSection}>
            <div className={styles.imageColumn}>
                <img 
                    src={currentImageUrl}
                    alt={`${product.brand} ${product.model}`} 
                />
            </div>

            <div className={styles.infoColumn}>     
                <h1 className={styles.productName}>{product.name}</h1>
                <p className={styles.basePrice}>{product.basePrice} EUR</p>

                <div className={`${styles.selectorSection} ${styles.storageSection}`}>
                <h4 className={styles.selectorTitle}>STORAGE ¿HOW MUCH SPACE DO YOU NEED?</h4>
                <div className={styles.storageGrid}>
                    {product.storageOptions.map((option, index) => (
                    <button 
                        key={option.storageCode}
                        className={`${styles.storageOption} ${index === selectedStorageIndex ? styles.selected : ''}`}
                        onClick={() => setSelectedStorageIndex(index)}
                    >
                        {option.name}
                    </button>
                    ))}
                </div>
                </div>

                <div className={`${styles.selectorSection} ${styles.colorSection}`}>
                <h4 className={styles.selectorTitle}>COLOR. PICK YOUR FAVOURITE.</h4>
                <div className={styles.colorGrid}>
                    {product.colorOptions.map((option, index) => (
                    <div 
                        key={option.colorCode}
                        className={`${styles.colorSwatchWrapper} ${index === selectedColorIndex ? styles.selected : ''}`}
                        onClick={() => setSelectedColorIndex(index)}
                    >
                        <div 
                        className={styles.colorSwatch}
                        style={{ backgroundColor: option.hexCode }}
                        title={option.name}
                        />
                    </div>
                    ))}
                </div>
                </div>

                <button 
                    className={styles.addToCartButton}
                    onClick={() => handleAddToCart()}
                >
                AÑADIR
                </button>
            </div>
        </section>

        <section className={styles.specificationsSection}>
        <h3 className={styles.specsTitle}>SPECIFICATIONS</h3>
        <div className={styles.specsPlaceholder}>
            [ Especifaciones ]
        </div>
        </section>
    </div>
  );
}