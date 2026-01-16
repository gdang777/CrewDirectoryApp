import { Product, PriceComparison } from '../services/api';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  comparison?: PriceComparison;
}

const categoryIcons: Record<string, string> = {
  chocolate: '🍫',
  cosmetics: '💄',
  spirits: '🥃',
  electronics: '📱',
};

// Fallback images based on category
const fallbackImages: Record<string, string> = {
  chocolate:
    'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&fit=crop',
  cosmetics:
    'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?w=400&fit=crop',
  spirits:
    'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&fit=crop',
  electronics:
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&fit=crop',
};

const ProductCard = ({ product, comparison }: ProductCardProps) => {
  const icon = categoryIcons[product.category] || '🛍️';
  const displayImage =
    product.metadata?.imageUrl ||
    fallbackImages[product.category] ||
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&fit=crop';

  const savingsPercent = comparison ? Math.round(comparison.deltaPercent) : 0;
  const isCheaper = savingsPercent < 0; // Negative delta means cheaper than home base

  return (
    <div className="product-card">
      <div
        className="product-image"
        style={{ backgroundImage: `url(${displayImage})` }}
      >
        <div className="category-badge">
          {icon} {product.category}
        </div>
        {comparison && isCheaper && (
          <div className="savings-badge">
            <span className="savings-label">SAVE</span>
            <span className="savings-value">{Math.abs(savingsPercent)}%</span>
          </div>
        )}
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        {comparison ? (
          <div className="price-comparison">
            <div className="price-row current">
              <span className="label">
                Here ({comparison.current.cityCode})
              </span>
              <span className="price">
                {comparison.current.amount} {comparison.current.currency}
              </span>
            </div>
            <div className="price-row home">
              <span className="label">
                Home ({comparison.homeBase.cityCode})
              </span>
              <span className="price strike">
                {comparison.homeBase.amount} {comparison.homeBase.currency}
              </span>
            </div>
          </div>
        ) : (
          <div className="price-placeholder">
            <span className="info-icon">ℹ️</span>
            Select a city to compare prices
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
