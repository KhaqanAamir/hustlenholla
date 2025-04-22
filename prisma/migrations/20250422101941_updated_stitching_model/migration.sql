-- DropForeignKey
ALTER TABLE "Item_Stitching" DROP CONSTRAINT "Item_Stitching_worker_id_fkey";

-- AlterTable
ALTER TABLE "Item_Stitching" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "piece_rate" INTEGER,
ALTER COLUMN "worker_id" DROP NOT NULL,
ALTER COLUMN "operations" DROP NOT NULL,
ALTER COLUMN "total_quantity" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Item_Stitching" ADD CONSTRAINT "Item_Stitching_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
