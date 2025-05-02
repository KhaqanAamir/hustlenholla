/*
  Warnings:

  - You are about to drop the column `order_details` on the `Item_Packaging` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item_Packaging" DROP COLUMN "order_details",
ADD COLUMN     "packaging_details" JSONB;
