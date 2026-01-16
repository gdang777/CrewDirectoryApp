import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleAndSavedListings1768596524989 implements MigrationInterface {
  name = 'AddRoleAndSavedListings1768596524989';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "saved_listings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "playbookId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f48ea812c715c172d94b565abaf" UNIQUE ("userId", "playbookId"), CONSTRAINT "PK_76fecd34cd602bd01b86147e025" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin', 'moderator')`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'user'`
    );
    await queryRunner.query(
      `ALTER TABLE "audio_walks" ALTER COLUMN "price" SET DEFAULT '1.99'`
    );
    await queryRunner.query(
      `ALTER TABLE "saved_listings" ADD CONSTRAINT "FK_d5d342b14ac39f97fe4f4279ee2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "saved_listings" ADD CONSTRAINT "FK_2aff011f310321557ffe2d8f318" FOREIGN KEY ("playbookId") REFERENCES "playbooks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "saved_listings" DROP CONSTRAINT "FK_2aff011f310321557ffe2d8f318"`
    );
    await queryRunner.query(
      `ALTER TABLE "saved_listings" DROP CONSTRAINT "FK_d5d342b14ac39f97fe4f4279ee2"`
    );
    await queryRunner.query(
      `ALTER TABLE "audio_walks" ALTER COLUMN "price" SET DEFAULT 1.99`
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "saved_listings"`);
  }
}
