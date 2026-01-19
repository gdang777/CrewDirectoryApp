import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFullTextSearch1737325000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add search_vector column to places table
    await queryRunner.query(`
      ALTER TABLE places
      ADD COLUMN IF NOT EXISTS search_vector tsvector
    `);

    // Create GIN index for fast full-text search on places
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS place_search_idx
      ON places
      USING gin(search_vector)
    `);

    // Create trigger to automatically update search_vector on insert/update
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION places_search_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector :=
          setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
          setweight(to_tsvector('english', COALESCE(NEW.tips, '')), 'C') ||
          setweight(to_tsvector('english', COALESCE(NEW.address, '')), 'D');
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS places_search_vector_update ON places
    `);

    await queryRunner.query(`
      CREATE TRIGGER places_search_vector_update
      BEFORE INSERT OR UPDATE ON places
      FOR EACH ROW
      EXECUTE FUNCTION places_search_trigger()
    `);

    // Populate search_vector for existing places
    await queryRunner.query(`
      UPDATE places
      SET search_vector =
        setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(tips, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(address, '')), 'D')
    `);

    // Add search_vector column to cities table
    await queryRunner.query(`
      ALTER TABLE cities
      ADD COLUMN IF NOT EXISTS search_vector tsvector
    `);

    // Create GIN index for cities
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS city_search_idx
      ON cities
      USING gin(search_vector)
    `);

    // Create trigger for cities
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cities_search_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.search_vector :=
          setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(NEW.country, '')), 'B') ||
          setweight(to_tsvector('english', COALESCE(NEW.code, '')), 'A');
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS cities_search_vector_update ON cities
    `);

    await queryRunner.query(`
      CREATE TRIGGER cities_search_vector_update
      BEFORE INSERT OR UPDATE ON cities
      FOR EACH ROW
      EXECUTE FUNCTION cities_search_trigger()
    `);

    // Populate search_vector for existing cities
    await queryRunner.query(`
      UPDATE cities
      SET search_vector =
        setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(country, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(code, '')), 'A')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop places search infrastructure
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS places_search_vector_update ON places`
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS places_search_trigger()`);
    await queryRunner.query(`DROP INDEX IF EXISTS place_search_idx`);
    await queryRunner.query(
      `ALTER TABLE places DROP COLUMN IF EXISTS search_vector`
    );

    // Drop cities search infrastructure
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS cities_search_vector_update ON cities`
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS cities_search_trigger()`);
    await queryRunner.query(`DROP INDEX IF EXISTS city_search_idx`);
    await queryRunner.query(
      `ALTER TABLE cities DROP COLUMN IF EXISTS search_vector`
    );
  }
}
