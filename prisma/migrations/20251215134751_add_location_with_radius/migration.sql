/*
  Warnings:

  - You are about to drop the column `location` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "locationAddress" TEXT,
ADD COLUMN     "locationLat" DOUBLE PRECISION,
ADD COLUMN     "locationLng" DOUBLE PRECISION,
ADD COLUMN     "locationRadius" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "location",
ADD COLUMN     "locationAddress" TEXT,
ADD COLUMN     "locationLat" DOUBLE PRECISION,
ADD COLUMN     "locationLng" DOUBLE PRECISION,
ADD COLUMN     "locationRadius" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "Profile_locationLat_locationLng_idx" ON "Profile"("locationLat", "locationLng");

-- CreateIndex
CREATE INDEX "Service_locationLat_locationLng_idx" ON "Service"("locationLat", "locationLng");
