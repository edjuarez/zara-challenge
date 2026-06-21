import styles from './ProductSpecifications.module.scss';
import { ProductDetail } from '../../services/api';

export const ProductSpecifications = ({ product }: { product: ProductDetail }) => {
  const allSpecs = { ...product, ...product.specs };

  const ignoredFields = ['id', 'basePrice', 'imageUrl', 'colorOptions', 'storageOptions', 'specs'];

  return (
    <section className={styles.specificationsSection}>
      <h3 className={styles.title}>SPECIFICATIONS</h3>
      
      <div className={styles.specsGrid}>
        {Object.entries(allSpecs).map(([key, value]) => {
          if (ignoredFields.includes(key) || typeof value === 'object') return null;
        // Si 'value' es un objeto o array, no lo intentamos renderizar
        if (typeof value === 'object' || value === null) return null;
          const label = key.replace(/([A-Z])/g, ' $1').toUpperCase();

          return (
            <div key={key} className={styles.specRow}>
              <span className={styles.specLabel}>{label}</span>
              <span className={styles.specValue}>{String(value)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};