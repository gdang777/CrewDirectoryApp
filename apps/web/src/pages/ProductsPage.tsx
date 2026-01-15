import { useState, useEffect } from 'react';
import type { Product } from '@crewdirectoryapp/shared';
import { apiService } from '../services/api';
import './ProductsPage.css';

interface ProductWithPrice extends Product {
  currentPrice?: {
    amount: number;
    currency: string;
    cityCode: string;
  };
  homeBasePrice?: {
    amount: number;
    currency: string;
  };
  priceDelta?: number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductWithPrice[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [homeBase, setHomeBase] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<ProductWithPrice[]>([]);

  const categories = ['all', 'chocolate', 'cosmetics', 'spirits'];

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      const data = await apiService.getProducts(category);
      setProducts(data as ProductWithPrice[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const comparePrices = async (productId: string) => {
    if (!selectedCity || !homeBase) {
      alert('Please select both city and home base for price comparison');
      return;
    }

    try {
      const comparison = await apiService.comparePrices(
        productId,
        selectedCity,
        homeBase,
      );
      // Update product with price comparison data
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                currentPrice: comparison.current,
                homeBasePrice: comparison.homeBase,
                priceDelta: comparison.deltaPercent,
              }
            : p,
        ),
      );
    } catch (err) {
      console.error('Price comparison failed:', err);
    }
  };

  const addToCart = (product: ProductWithPrice) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="products-page">
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="category-select">Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="city-select">Layover City:</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">Select city</option>
            <option value="CPH">Copenhagen (CPH)</option>
            <option value="BKK">Bangkok (BKK)</option>
            <option value="DXB">Dubai (DXB)</option>
            <option value="JFK">New York (JFK)</option>
            <option value="LHR">London (LHR)</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="homebase-select">Home Base:</label>
          <select
            id="homebase-select"
            value={homeBase}
            onChange={(e) => setHomeBase(e.target.value)}
          >
            <option value="">Select home base</option>
            <option value="CPH">Copenhagen (CPH)</option>
            <option value="BKK">Bangkok (BKK)</option>
            <option value="DXB">Dubai (DXB)</option>
            <option value="JFK">New York (JFK)</option>
            <option value="LHR">London (LHR)</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-results">No products found</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p className="category-badge">{product.category}</p>
              <p className="description">{product.description}</p>
              <p className="sku">SKU: {product.sku}</p>

              {product.currentPrice && (
                <div className="price-info">
                  <div className="price-row">
                    <span>Current ({product.currentPrice.cityCode}):</span>
                    <span className="price">
                      {product.currentPrice.currency} {product.currentPrice.amount}
                    </span>
                  </div>
                  {product.homeBasePrice && (
                    <div className="price-row">
                      <span>Home Base:</span>
                      <span className="price">
                        {product.homeBasePrice.currency} {product.homeBasePrice.amount}
                      </span>
                    </div>
                  )}
                  {product.priceDelta !== undefined && (
                    <div
                      className={`price-delta ${
                        product.priceDelta > 0 ? 'positive' : 'negative'
                      }`}
                    >
                      {product.priceDelta > 0 ? '↑' : '↓'}{' '}
                      {Math.abs(product.priceDelta).toFixed(1)}%
                    </div>
                  )}
                </div>
              )}

              <div className="product-actions">
                {selectedCity && homeBase && (
                  <button
                    onClick={() => comparePrices(product.id)}
                    className="btn-compare"
                  >
                    Compare Prices
                  </button>
                )}
                <button
                  onClick={() => addToCart(product)}
                  className="btn-add-cart"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-sidebar">
          <h3>Cart ({cart.length})</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
