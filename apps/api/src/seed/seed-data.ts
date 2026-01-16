import { DataSource } from 'typeorm';
import { City } from '../modules/playbooks/entities/city.entity';
import { Product } from '../modules/products/entities/product.entity';
import dataSource from '../config/typeorm.config';

export async function seedDatabase() {
  const connection = await dataSource.initialize();

  try {
    const cityRepository = connection.getRepository(City);
    const productRepository = connection.getRepository(Product);

    // Seed Cities
    const cities = [
      {
        name: 'Copenhagen',
        country: 'Denmark',
        code: 'CPH',
        coordinates: {
          type: 'Point' as const,
          coordinates: [12.5683, 55.6761], // [lng, lat]
        },
      },
      {
        name: 'Bangkok',
        country: 'Thailand',
        code: 'BKK',
        coordinates: {
          type: 'Point' as const,
          coordinates: [100.5018, 13.7563],
        },
      },
      {
        name: 'Dubai',
        country: 'UAE',
        code: 'DXB',
        coordinates: {
          type: 'Point' as const,
          coordinates: [55.2708, 25.2048],
        },
      },
      {
        name: 'New York',
        country: 'USA',
        code: 'JFK',
        coordinates: {
          type: 'Point' as const,
          coordinates: [-73.7781, 40.6413],
        },
      },
      {
        name: 'London',
        country: 'UK',
        code: 'LHR',
        coordinates: {
          type: 'Point' as const,
          coordinates: [-0.4543, 51.47],
        },
      },
    ];

    for (const cityData of cities) {
      const existingCity = await cityRepository.findOne({
        where: { code: cityData.code },
      });
      if (!existingCity) {
        const city = cityRepository.create(cityData);
        await cityRepository.save(city);
        console.log(`✓ Seeded city: ${cityData.name}`);
      }
    }

    // Seed Sample Products
    const products = [
      {
        name: 'Belgian Chocolate Assortment',
        description: 'Premium Belgian chocolates',
        sku: 'CHOCO-001',
        category: 'chocolate',
      },
      {
        name: 'Swiss Chocolate Bar',
        description: 'High-quality Swiss chocolate',
        sku: 'CHOCO-002',
        category: 'chocolate',
      },
      {
        name: 'French Perfume Set',
        description: 'Luxury French perfume collection',
        sku: 'COSMETIC-001',
        category: 'cosmetics',
      },
      {
        name: 'Japanese Skincare Kit',
        description: 'Premium Japanese skincare products',
        sku: 'COSMETIC-002',
        category: 'cosmetics',
      },
      {
        name: 'Scotch Whisky',
        description: 'Aged single malt scotch',
        sku: 'SPIRIT-001',
        category: 'spirits',
      },
      {
        name: 'French Cognac',
        description: 'Premium French cognac',
        sku: 'SPIRIT-002',
        category: 'spirits',
      },
    ];

    for (const productData of products) {
      const existingProduct = await productRepository.findOne({
        where: { sku: productData.sku },
      });
      if (!existingProduct) {
        const product = productRepository.create(productData);
        await productRepository.save(product);
        console.log(`✓ Seeded product: ${productData.name}`);
      }
    }

    console.log('✅ Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.destroy();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
