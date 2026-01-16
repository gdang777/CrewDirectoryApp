import { useState, useEffect } from 'react';
import apiService, { City } from '../services/api';

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCities();
      setCities(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch cities:', err);
      setError('Failed to load cities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const refetch = () => {
    fetchCities();
  };

  return { cities, loading, error, refetch };
}

export function useCity(code: string | undefined) {
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setLoading(false);
      return;
    }

    const fetchCity = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCityByCode(code);
        setCity(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch city:', err);
        setError('Failed to load city');
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [code]);

  return { city, loading, error };
}
