import { useState, useEffect } from 'react';
import type { Product } from '@crewdirectoryapp/shared';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import RecommendationEditor from '../components/RecommendationEditor';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const categories = ['all', 'chocolate', 'cosmetics', 'spirits', 'other'];

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const category =
        selectedCategory === 'all' ? undefined : selectedCategory;
      const data = await apiService.getProducts(category);
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load recommendations'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadProducts} />;
  }

  return (
    <div className="products-page">
      <div className="header-section">
        <h1>Layover Recommendations</h1>
        <button onClick={() => setShowEditor(true)} className="create-button">
          + Add Recommendation
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="category-select">Filter by Category:</label>
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
      </div>

      {showEditor && (
        <RecommendationEditor
          onClose={() => setShowEditor(false)}
          onSave={loadProducts}
        />
      )}

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-results">
            No recommendations found. Be the first to add one!
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p className="category-badge">{product.category}</p>
              <p className="description">
                {product.description || 'No description provided.'}
              </p>

              <div className="recommendation-footer">
                <span className="recommended-by">Recommended by Crew</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
