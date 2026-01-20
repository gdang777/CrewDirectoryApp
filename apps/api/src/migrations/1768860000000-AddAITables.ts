import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAITables1768860000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create itineraries table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS itineraries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
        duration INT NOT NULL,
        items JSONB NOT NULL,
        preferences JSONB,
        summary TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create index on user_id for fast lookups
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_itinerary_user
      ON itineraries(user_id)
    `);

    // Create user_interactions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_interactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('view', 'like', 'comment', 'save', 'skip')),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_interaction_user
      ON user_interactions(user_id)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_interaction_place
      ON user_interactions(place_id)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_user_interaction_created
      ON user_interactions(created_at DESC)
    `);

    // Create user_preferences table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        favorite_categories TEXT,
        favorite_cities TEXT,
        price_preference VARCHAR(20),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create unique index on user_id
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_user_preference_user
      ON user_preferences(user_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order (respecting foreign keys)
    await queryRunner.query(`DROP TABLE IF EXISTS user_preferences CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_interactions CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS itineraries CASCADE`);
  }
}
