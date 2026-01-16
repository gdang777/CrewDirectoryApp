import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { City } from '../modules/playbooks/entities/city.entity';
import { Product } from '../modules/products/entities/product.entity';
import { Price } from '../modules/products/entities/price.entity';
import { User, UserRole } from '../modules/playbooks/entities/user.entity';
import { Place } from '../modules/places/entities/place.entity';
import dataSource from '../config/typeorm.config';

export async function seedDatabase() {
  const connection = await dataSource.initialize();

  try {
    const cityRepository = connection.getRepository(City);
    const productRepository = connection.getRepository(Product);
    const priceRepository = connection.getRepository(Price);
    const userRepository = connection.getRepository(User);
    const placeRepository = connection.getRepository(Place);

    // Seed Admin User
    const adminEmail = 'admin@crewlounge.com';
    const existingAdmin = await userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        verifiedBadge: true,
        karmaScore: 100,
      });
      await userRepository.save(admin);
      console.log(`✓ Seeded admin user: ${adminEmail} (password: admin123)`);
    }

    // Seed Moderator User
    const modEmail = 'moderator@crewlounge.com';
    const existingMod = await userRepository.findOne({
      where: { email: modEmail },
    });

    if (!existingMod) {
      const hashedPassword = await bcrypt.hash('mod123', 10);
      const moderator = userRepository.create({
        email: modEmail,
        password: hashedPassword,
        name: 'Moderator User',
        firstName: 'Moderator',
        lastName: 'User',
        role: UserRole.MODERATOR,
        verifiedBadge: true,
        karmaScore: 50,
      });
      await userRepository.save(moderator);
      console.log(`✓ Seeded moderator user: ${modEmail} (password: mod123)`);
    }

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

    const cityMap: Record<string, string> = {};
    for (const cityData of cities) {
      let city = await cityRepository.findOne({
        where: { code: cityData.code },
      });
      if (!city) {
        city = cityRepository.create(cityData);
        await cityRepository.save(city);
        console.log(`✓ Seeded city: ${cityData.name}`);
      }
      cityMap[cityData.code] = city.id;
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

    // Seed Prices
    const seededProducts = await productRepository.find();
    for (const product of seededProducts) {
      const prices = [];
      const basePrice = Math.floor(Math.random() * 50) + 10; // Random base price

      if (product.category === 'chocolate') {
        prices.push(
          {
            amount: 12.5,
            currency: 'USD',
            cityCode: 'JFK',
            productId: product.id,
          },
          {
            amount: 8.5,
            currency: 'EUR',
            cityCode: 'CPH',
            productId: product.id,
          }, // Cheaper in CPH
          {
            amount: 15.0,
            currency: 'AED',
            cityCode: 'DXB',
            productId: product.id,
          }
        );
      } else if (product.category === 'cosmetics') {
        prices.push(
          {
            amount: 95.0,
            currency: 'USD',
            cityCode: 'JFK',
            productId: product.id,
          },
          {
            amount: 110.0,
            currency: 'GBP',
            cityCode: 'LHR',
            productId: product.id,
          },
          {
            amount: 65.0,
            currency: 'THB',
            cityCode: 'BKK',
            productId: product.id,
          } // Cheaper in BKK
        );
      } else if (product.category === 'spirits') {
        prices.push(
          {
            amount: 45.0,
            currency: 'GBP',
            cityCode: 'LHR',
            productId: product.id,
          }, // Cheaper in LHR
          {
            amount: 65.0,
            currency: 'USD',
            cityCode: 'JFK',
            productId: product.id,
          },
          {
            amount: 75.0,
            currency: 'AED',
            cityCode: 'DXB',
            productId: product.id,
          }
        );
      }

      for (const priceData of prices) {
        const existingPrice = await priceRepository.findOne({
          where: { productId: product.id, cityCode: priceData.cityCode },
        });

        if (!existingPrice) {
          const price = priceRepository.create(priceData);
          await priceRepository.save(price);
          console.log(
            `✓ Seeded price for ${product.name} in ${priceData.cityCode}: ${priceData.amount} ${priceData.currency}`
          );
        }
      }
    }

    // Seed Sample Places
    const placesData = [
      // Copenhagen
      {
        name: 'The Coffee Collective',
        description:
          'Award-winning specialty coffee roasters. Try the flat white!',
        tips: 'Go early to avoid the lunch rush.',
        category: 'drink' as const,
        cityCode: 'CPH',
        imageUrl:
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
        rating: 4.8,
        ratingCount: 42,
        upvotes: 42,
        downvotes: 2,
        latitude: 55.6938,
        longitude: 12.5593,
      },
      {
        name: 'Torvehallerne',
        description:
          'Covered food market with amazing Danish pastries and fresh produce.',
        tips: 'The smørrebrød stand in the back is the best.',
        category: 'eat' as const,
        cityCode: 'CPH',
        imageUrl:
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
        rating: 4.7,
        ratingCount: 38,
        upvotes: 38,
        downvotes: 1,
        latitude: 55.6835,
        longitude: 12.5719,
      },
      {
        name: 'Nyhavn',
        description:
          'Iconic colorful harbor. Perfect for photos and a canal cruise.',
        tips: 'Skip the restaurants here - overpriced. Just walk around.',
        category: 'visit' as const,
        cityCode: 'CPH',
        imageUrl:
          'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=600&fit=crop',
        rating: 4.9,
        ratingCount: 56,
        upvotes: 56,
        downvotes: 0,
        latitude: 55.6795,
        longitude: 12.5933,
      },
      // Bangkok
      {
        name: 'Thip Samai',
        description: 'Best Pad Thai in Bangkok. Worth the queue!',
        tips: 'Get the version wrapped in egg.',
        category: 'eat' as const,
        cityCode: 'BKK',
        imageUrl:
          'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=600&fit=crop',
        rating: 4.9,
        ratingCount: 89,
        upvotes: 89,
        downvotes: 4,
        latitude: 13.7523,
        longitude: 100.5042,
      },
      {
        name: 'Chatuchak Weekend Market',
        description: 'Massive market with everything from clothes to antiques.',
        tips: 'Go early Saturday morning to beat the heat and crowds.',
        category: 'shop' as const,
        cityCode: 'BKK',
        imageUrl:
          'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop',
        rating: 4.6,
        ratingCount: 67,
        upvotes: 67,
        downvotes: 2,
        latitude: 13.8016,
        longitude: 100.5519,
      },
      {
        name: 'Sky Bar',
        description: 'Rooftop bar with incredible views. Dress code enforced.',
        tips: 'Go for sunset. Drinks are expensive but the view is free.',
        category: 'drink' as const,
        cityCode: 'BKK',
        imageUrl:
          'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop',
        rating: 4.4,
        ratingCount: 54,
        upvotes: 54,
        downvotes: 8,
        latitude: 13.7214,
        longitude: 100.5173,
      },
      // Dubai
      {
        name: 'Al Mallah',
        description: 'Amazing shawarma and fresh juices at local prices.',
        category: 'eat' as const,
        cityCode: 'DXB',
        imageUrl:
          'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&h=600&fit=crop',
        rating: 4.6,
        ratingCount: 45,
        upvotes: 45,
        downvotes: 2,
        latitude: 25.2396,
        longitude: 55.2891,
      },
      {
        name: 'Gold Souk',
        description:
          'Traditional market for gold jewelry. Bargaining expected!',
        tips: 'Check gold price online first. Negotiate hard.',
        category: 'shop' as const,
        cityCode: 'DXB',
        imageUrl:
          'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&h=600&fit=crop',
        rating: 4.5,
        ratingCount: 52,
        upvotes: 52,
        downvotes: 5,
        latitude: 25.2683,
        longitude: 55.2974,
      },
      // New York
      {
        name: "Katz's Delicatessen",
        description: 'Legendary pastrami sandwiches since 1888.',
        tips: 'Cash only at the counter. Tip the cutter!',
        category: 'eat' as const,
        cityCode: 'JFK',
        imageUrl:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
        rating: 4.7,
        ratingCount: 73,
        upvotes: 73,
        downvotes: 3,
        latitude: 40.7222,
        longitude: -73.9874,
      },
      {
        name: 'The High Line',
        description: 'Elevated park with art installations and city views.',
        category: 'visit' as const,
        cityCode: 'JFK',
        imageUrl:
          'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop',
        rating: 4.8,
        ratingCount: 88,
        upvotes: 88,
        downvotes: 1,
        latitude: 40.7484,
        longitude: -74.0048,
      },
      // London
      {
        name: 'Dishoom',
        description: 'Bombay cafe vibe with amazing breakfast naan rolls.',
        tips: 'The black daal is signature. Queue can be long.',
        category: 'eat' as const,
        cityCode: 'LHR',
        imageUrl:
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&fit=crop',
        rating: 4.9,
        ratingCount: 102,
        upvotes: 102,
        downvotes: 1,
        latitude: 51.5126,
        longitude: -0.1378,
      },
    ];

    for (const placeData of placesData) {
      const existing = await placeRepository.findOne({
        where: { name: placeData.name, cityId: cityMap[placeData.cityCode] },
      });
      if (!existing && cityMap[placeData.cityCode]) {
        const place = placeRepository.create({
          name: placeData.name,
          description: placeData.description,
          tips: placeData.tips,
          category: placeData.category,
          cityId: cityMap[placeData.cityCode],
          imageUrl: placeData.imageUrl,
          rating: placeData.rating,
          ratingCount: placeData.ratingCount,
          upvotes: placeData.upvotes,
          downvotes: placeData.downvotes,
          latitude: placeData.latitude,
          longitude: placeData.longitude,
        });
        await placeRepository.save(place);
        console.log(`✓ Seeded place: ${placeData.name}`);
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
