import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGigsTables1737497000000 implements MigrationInterface {
  name = 'AddGigsTables1737497000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create gigs table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "gigs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar NOT NULL,
        "description" text NOT NULL,
        "category" varchar NOT NULL,
        "cityId" uuid NOT NULL,
        "payRate" decimal(10,2) NOT NULL,
        "payType" varchar NOT NULL,
        "duration" varchar,
        "requirements" text,
        "status" varchar NOT NULL DEFAULT 'active',
        "imageUrl" text,
        "postedById" uuid NOT NULL,
        "postedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expiresAt" timestamp,
        "applicationCount" integer NOT NULL DEFAULT 0,
        "createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FK_gig_city" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_gig_user" FOREIGN KEY ("postedById") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create gig_applications table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "gig_applications" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "gigId" uuid NOT NULL,
        "applicantId" uuid NOT NULL,
        "message" text,
        "status" varchar NOT NULL DEFAULT 'pending',
        "appliedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FK_application_gig" FOREIGN KEY ("gigId") REFERENCES "gigs"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_application_user" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_gig_applicant" UNIQUE ("gigId", "applicantId")
      )
    `);

    // Create  indexes for performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_gigs_city" ON "gigs"("cityId")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_gigs_category" ON "gigs"("category")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_gigs_status" ON "gigs"("status")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_gigs_posted_at" ON "gigs"("postedAt")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_applications_gig" ON "gig_applications"("gigId")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_applications_user" ON "gig_applications"("applicantId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "gig_applications" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "gigs" CASCADE`);
  }
}
