/*
  Warnings:

  - You are about to alter the column `durationMin` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Text`.

*/
-- AlterTable: Convert durationMin (integer) to duration (text)
-- First add the new column
ALTER TABLE "Service" ADD COLUMN "duration" TEXT;

-- Migrate existing data: convert durationMin to "X mins" format
UPDATE "Service" SET "duration" = CAST("durationMin" AS TEXT) || ' mins' WHERE "durationMin" IS NOT NULL;

-- Drop the old column
ALTER TABLE "Service" DROP COLUMN "durationMin";
