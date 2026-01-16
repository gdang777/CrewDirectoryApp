import { useState, useEffect } from 'react';
import { apiService, Product, PriceComparison } from '../services/api';
import { useCities } from '../hooks/useCities';
import { useAuth } from '../context/AuthContext';
import ProductCard from './ProductCard';
import AddTipModal from './AddTipModal';
import './ShoppingSection.css';

interface ShoppingSectionProps {
  cityCode: string; // The layover city
}

const ShoppingSection = ({ cityCode }: ShoppingSectionProps) => {
  const { cities } = useCities();
  const { user, isAuthenticated } = useAuth();

  const [homeBase, setHomeBase] = useState<string>('LHR'); // Default
  const [products, setProducts] = useState<
    { product: Product; comparison?: PriceComparison }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    // Try to set home base from user profile if available, else LHR
    // For MVP, just keeping LHR default or user selection
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [cityCode, homeBase]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      if (cityCode === homeBase) {
        const data = await apiService.getProducts(); // Just fetch products if same city
        setProducts(data.map((p) => ({ product: p })));
      } else {
        const data = await apiService.getProductsWithPriceDelta(
          cityCode,
          homeBase
        );
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load shopping guide:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleHomeBaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHomeBase(e.target.value);
  };

  return (
    <div className="shopping-section">
      <div className="shopping-header">
        <div className="header-text">
          <h2>Layover Shopping Guide</h2>
          <p>Best buys in {cityCode} vs your Home Base</p>
        </div>

        <div className="header-actions">
          <div className="home-base-selector">
            <label>Compare with:</label>
            <select value={homeBase} onChange={handleHomeBaseChange}>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.code}
                </option>
              ))}
            </select>
          </div>

          <button
            className="add-tip-btn"
            onClick={() => {
              if (!isAuthenticated) {
                alert('Please login to add a tip');
                return;
              }
              setIsAddModalOpen(true);
            }}
          >
            + Add Tip
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Finding best deals...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>
            No specific deals found for {cityCode}. Be the first to add one!
          </p>
        </div>
      ) : (
        <div className="shopping-grid">
          {products.map(({ product, comparison }) => (
            <ProductCard
              key={product.id}
              product={product}
              comparison={comparison}
            />
          ))}
        </div>
      )}

      <AddTipModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        cityCode={cityCode}
        onSuccess={loadProducts}
      />
    </div>
  );
};

export default ShoppingSection;
