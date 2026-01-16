import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlacesAndComments1768597069741 implements MigrationInterface {
  name = 'AddPlacesAndComments1768597069741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audio_walks" ALTER COLUMN "price" SET DEFAULT '1.99'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audio_walks" ALTER COLUMN "price" SET DEFAULT 1.99`
    );
  }
}
