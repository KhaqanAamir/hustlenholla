/*
  Warnings:

  - Made the column `last_updated` on table `Item_Cutting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_updated` on table `Item_Dispatch` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_updated` on table `Item_Finishing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_updated` on table `Item_Packaging` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_updated` on table `Item_Quality_Control` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_updated` on table `Item_Stitching` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_updated` on table `Item_Washing` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Item_Cutting" DROP CONSTRAINT "Item_Cutting_worker_id_fkey";

-- AlterTable
ALTER TABLE "Item_Cutting" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "piece_rate" INTEGER,
ALTER COLUMN "last_updated" SET NOT NULL,
ALTER COLUMN "worker_id" DROP NOT NULL,
ALTER COLUMN "operations" DROP NOT NULL,
ALTER COLUMN "total_quantity" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Item_Dispatch" ALTER COLUMN "last_updated" SET NOT NULL;

-- AlterTable
ALTER TABLE "Item_Finishing" ALTER COLUMN "last_updated" SET NOT NULL;

-- AlterTable
ALTER TABLE "Item_Packaging" ALTER COLUMN "last_updated" SET NOT NULL;

-- AlterTable
ALTER TABLE "Item_Quality_Control" ALTER COLUMN "last_updated" SET NOT NULL;

-- AlterTable
ALTER TABLE "Item_Stitching" ALTER COLUMN "last_updated" SET NOT NULL;

-- AlterTable
ALTER TABLE "Item_Washing" ALTER COLUMN "last_updated" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Item_Cutting" ADD CONSTRAINT "Item_Cutting_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
