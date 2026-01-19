import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageFields1737324000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add imageUrl to cities table
    await queryRunner.query(`
      ALTER TABLE cities
      ADD COLUMN IF NOT EXISTS "imageUrl" VARCHAR(500)
    `);

    // Add avatarUrl to users table
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS "avatarUrl" VARCHAR(500)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove imageUrl from cities
    await queryRunner.query(`
      ALTER TABLE cities
      DROP COLUMN IF EXISTS "imageUrl"
    `);

    // Remove avatarUrl from users
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS "avatarUrl"
    `);
  }
}
