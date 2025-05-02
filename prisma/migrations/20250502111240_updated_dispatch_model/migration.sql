-- AlterTable
ALTER TABLE "Item_Dispatch" ADD COLUMN     "completed_at" TIMESTAMP(3),
ALTER COLUMN "dispatching_details" DROP NOT NULL,
ALTER COLUMN "operations" DROP NOT NULL,
ALTER COLUMN "total_quantity" DROP NOT NULL;
