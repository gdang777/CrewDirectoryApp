import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable PostGIS extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);

    // Note: TypeORM will create tables automatically based on entities
    // This migration is for PostGIS extension and any custom setup
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Disable PostGIS extension (be careful - this will remove all PostGIS data)
    // await queryRunner.query(`DROP EXTENSION IF EXISTS postgis;`);
  }
}
