-- AlterTable
ALTER TABLE "Order_Item" ALTER COLUMN "current_process" DROP NOT NULL,
ALTER COLUMN "current_process" DROP DEFAULT;
