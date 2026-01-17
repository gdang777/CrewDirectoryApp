import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatTables1768602487472 implements MigrationInterface {
  name = 'CreateChatTables1768602487472';

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
