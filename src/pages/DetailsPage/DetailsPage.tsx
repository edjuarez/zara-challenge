import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, ProductDetail } from "../../services/api";
import { useCart } from "../../hooks/useCart";
import { ProductSpecifications } from "../../components/ProductSpecifications/ProductSpecifications";
import { SimilarItems } from "../../components/SimilarItems/SimilarItems";
import styles from "./DetailsPage.module.scss";

export interface ColorOption { 
  colorCode: string;
  hexCode: string;
  name: string;
  imageUrl: string;
}

export interface StorageOption {
  storageCode: string;
  capacity: string;
  price: number; 
}

export default function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStorageIndex, setSelectedStorageIndex] = useState<number | null>(null);
    const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            setSelectedColorIndex(null);
            setSelectedStorageIndex(null);
            window.scrollTo(0, 0);

            getProductById(id)
            .then((data) => {
                setProduct(data);
            })
            .catch((error) => console.error("Error cargando producto:", error))
            .finally(() => setIsLoading(false));
        }
    }, [id]);

    if (isLoading) return <div style={{ padding: "4rem", textAlign: "center", fontSize: "0.8rem", textTransform: "uppercase" }}>Cargando especificaciones...</div>;
    if (!product) return <div style={{ padding: "4rem", textAlign: "center" }}>Producto no encontrado.</div>;

    const currentImageUrl = selectedColorIndex !== null
        ? product.colorOptions[selectedColorIndex].imageUrl
        : product.colorOptions[0].imageUrl;

    const currentPrice = selectedStorageIndex !== null
        ? product.storageOptions[selectedStorageIndex].price
        : product.basePrice;

    const isButtonDisabled = selectedColorIndex === null || selectedStorageIndex === null;

    const isStorageSelected = selectedStorageIndex !== null;
    const priceDisplay = isStorageSelected
        ? `${currentPrice} EUR`
        : `From ${currentPrice} EUR`;
    const handleAddToCart = () => {
        if (!product || selectedColorIndex === null || selectedStorageIndex === null) return;

        const { colorOptions, storageOptions, id, brand, name } = product;
        const colorSelected = colorOptions[selectedColorIndex];
        const storageSelected = storageOptions[selectedStorageIndex];

        addToCart({
            id,
            brand,
            name,
            price: storageSelected.price,
            imageUrl: colorSelected.imageUrl,
            selectedColor: colorSelected.name,
            selectedStorage: storageSelected.capacity,
            hexCode: colorSelected.hexCode
        });
        navigate("/cart");
    };

  return (
    <>
        <header className={styles.pageHeader}>
            <button 
            className={styles.backButton} onClick={() => navigate("/")}
            aria-label="Volver al catálogo principal">
                 &lt; BACK
            </button>
        </header>
        <section className={styles.mainProductSection}>
            <div className={styles.imageColumn}>
                <img 
                    src={currentImageUrl}
                    alt={`${product.brand} ${product.name}`} 
                />
            </div>

            <div className={styles.infoColumn}> 
                <h1 className={styles.productName}>{product.name}</h1>
                <p className={styles.basePrice} aria-live="polite">{priceDisplay}</p>

                <div className={`${styles.selectorSection} ${styles.storageSection}`}>
                <h2 className={styles.selectorTitle}>STORAGE ¿HOW MUCH SPACE DO YOU NEED?</h2>
                <div className={styles.storageGrid} role="group">
                    {product.storageOptions.map((option, index) => (
                    <button 
                        key={option.capacity}
                        className={`${styles.storageOption} ${index === selectedStorageIndex ? styles.selected : ''}`}
                        onClick={() => setSelectedStorageIndex(index)}
                        aria-pressed={index === selectedStorageIndex}
                    >
                        {option.capacity}
                    </button>
                    ))}
                </div>
                </div>

                <div className={`${styles.selectorSection} ${styles.colorSection}`}>
                <h2 className={styles.selectorTitle}>COLOR. PICK YOUR FAVOURITE.</h2>
                <div className={styles.colorGrid} role="group" aria-label="Opciones de color">
                    {product.colorOptions.map((option, index) => (
                    <button 
                        type="button"
                        key={option.hexCode}
                        className={`${styles.colorSwatchWrapper} 
                        ${index === selectedColorIndex ? styles.selected : ''}
                        ${index === selectedColorIndex ? styles.clicked : ''} `}
                        onClick={() => setSelectedColorIndex(index)}
                        aria-label={`Color ${option.name}`}
                        aria-pressed={index === selectedColorIndex}
                    >
                        <div 
                        className={styles.colorSwatch}
                        style={{ backgroundColor: option.hexCode }}
                        />
                    </button>
                    ))}
                </div>
                <span className={styles.colorName} aria-live="polite">
                    {selectedColorIndex !== null ? product.colorOptions[selectedColorIndex].name : ''}
                </span> 
                </div>

                <button 
                    className={`${styles.addToCartButton} ${isButtonDisabled ? styles.disabled : ''}`}
                    disabled={isButtonDisabled}
                    onClick={handleAddToCart}
                >
                AÑADIR
                </button>
            </div>
        </section>
        <ProductSpecifications product={product} />
        <SimilarItems currentProductId={product.id} />
    </>
  );
}