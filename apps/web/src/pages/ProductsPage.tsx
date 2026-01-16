import { useState, useEffect } from 'react';
import { apiService, Product, PriceComparison } from '../services/api';
import { useCities } from '../hooks/useCities';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const ProductsPage = () => {
  const { cities, loading: citiesLoading } = useCities();

  const [currentCity, setCurrentCity] = useState<string>('');
  const [homeBase, setHomeBase] = useState<string>('LHR'); // Default to London

  const [products, setProducts] = useState<
    { product: Product; comparison?: PriceComparison }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set default current city if cities loaded and none selected
    if (cities.length > 0 && !currentCity) {
      setCurrentCity(cities[0].code);
    }
  }, [cities]);

  useEffect(() => {
    loadProducts();
  }, [currentCity, homeBase]);

  const loadProducts = async () => {
    if (!currentCity || !homeBase) return;

    try {
      setLoading(true);
      setError(null);

      // If same city, just fetch all products without comparison
      if (currentCity === homeBase) {
        const data = await apiService.getProducts();
        setProducts(data.map((p) => ({ product: p })));
      } else {
        const data = await apiService.getProductsWithPriceDelta(
          currentCity,
          homeBase
        );
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load recommendations'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentCity(e.target.value);
  };

  const handleHomeBaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHomeBase(e.target.value);
  };

  if (citiesLoading) {
    return (
      <div className="products-page loading">
        <div className="loading-spinner">Loading cities...</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Shopping Guide</h1>
        <p className="subtitle">
          Find the best deals on your layover compared to home.
        </p>

        <div className="comparison-controls">
          <div className="control-group">
            <label htmlFor="current-city">I am in:</label>
            <select
              id="current-city"
              value={currentCity}
              onChange={handleCityChange}
              className="city-select"
            >
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name} ({city.code})
                </option>
              ))}
            </select>
          </div>

          <div className="swap-icon">⇄</div>

          <div className="control-group">
            <label htmlFor="home-base">My Home Base:</label>
            <select
              id="home-base"
              value={homeBase}
              onChange={handleHomeBaseChange}
              className="city-select"
            >
              {cities.map((city) => (
                <option key={city.code} value={city.code}>
                  {city.name} ({city.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="products-content">
        {loading ? (
          <div className="loading-spinner">Finding best deals...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No deals found</h3>
            <p>Try comparing different cities or check back later.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(({ product, comparison }) => (
              <ProductCard
                key={product.id}
                product={product}
                comparison={comparison}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
