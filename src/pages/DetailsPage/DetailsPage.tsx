import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, ProductDetail } from "../../services/api";
import { useCart } from "../../context/CartContext";
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
    const [selectedStorageIndex, setSelectedStorageIndex] = useState<number>(0);
    const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
    const { addToCart } = useCart();

    useEffect(() => {
        if (id) {
            getProductById(id)
            .then((data) => {
                setProduct(data)
                console.log(data)
                const defaultIndex = data.storageOptions.findIndex(
                    (option) => option.price === data.basePrice
                );

            setSelectedStorageIndex(defaultIndex !== -1 ? defaultIndex : 0);
            })
            .catch((error) => console.error("Error cargando producto:", error))
            .finally(() => setIsLoading(false));
        }
    }, [id]);
    if (isLoading) return <div style={{ padding: "4rem", textAlign: "center", fontSize: "0.8rem", textTransform: "uppercase" }}>Cargando especificaciones...</div>;
    if (!product) return <div style={{ padding: "4rem", textAlign: "center" }}>Producto no encontrado.</div>;

    const handleAddToCart = () => {
        if (!product) return;
        const colorSeleccionado = product.colorOptions[selectedColorIndex];
        const almacenamientoSeleccionado = product.storageOptions[selectedStorageIndex];
        addToCart({
            id: product.id,
            brand: product.brand,
            name: product.name,
            price: currentPrice,
            imageUrl: colorSeleccionado.imageUrl,
            selectedColor: colorSeleccionado.name,
            selectedStorage: almacenamientoSeleccionado.capacity,
            hexCode: colorSeleccionado.hexCode
        });

        // alert(`¡Añadido al carrito: ${product.name} (${almacenamientoSeleccionado.capacity} / ${colorSeleccionado.name})!`);
    };
    const currentStorage = product.storageOptions[selectedStorageIndex];
    const currentPrice = currentStorage.price;
    const currentImageUrl = product.colorOptions[selectedColorIndex].imageUrl;
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
                    alt={`${product.brand} ${product.name}`} 
                />
            </div>

            <div className={styles.infoColumn}>     
                <h1 className={styles.productName}>{product.name}</h1>
                <p className={styles.basePrice}>{currentPrice} EUR</p>

                <div className={`${styles.selectorSection} ${styles.storageSection}`}>
                <h2 className={styles.selectorTitle}>STORAGE ¿HOW MUCH SPACE DO YOU NEED?</h2>
                <div className={styles.storageGrid}>
                    {product.storageOptions.map((option, index) => (
                    <button 
                        key={option.price}
                        className={`${styles.storageOption} ${index === selectedStorageIndex ? styles.selected : ''}`}
                        onClick={() => setSelectedStorageIndex(index)}
                    >
                        {option.capacity}
                    </button>
                    ))}
                </div>
                </div>

                <div className={`${styles.selectorSection} ${styles.colorSection}`}>
                <h2 className={styles.selectorTitle}>COLOR. PICK YOUR FAVOURITE.</h2>
                <div className={styles.colorGrid}>
                    {product.colorOptions.map((option, index) => (
                    <div 
                        key={option.hexCode}
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