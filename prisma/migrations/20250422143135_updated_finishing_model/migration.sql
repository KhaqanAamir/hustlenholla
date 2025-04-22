-- AlterTable
ALTER TABLE "Item_Finishing" ADD COLUMN     "completed_at" TIMESTAMP(3),
ALTER COLUMN "finishing_details" DROP NOT NULL,
ALTER COLUMN "operations" DROP NOT NULL;
