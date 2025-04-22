-- AlterTable
ALTER TABLE "Item_Washing" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "piece_rate" INTEGER,
ALTER COLUMN "washing_details" DROP NOT NULL,
ALTER COLUMN "operations" DROP NOT NULL,
ALTER COLUMN "total_quantity" DROP NOT NULL;
