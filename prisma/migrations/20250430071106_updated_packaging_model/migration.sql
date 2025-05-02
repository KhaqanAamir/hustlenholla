-- AlterTable
ALTER TABLE "Item_Packaging" ALTER COLUMN "order_details" DROP NOT NULL,
ALTER COLUMN "operations" DROP NOT NULL,
ALTER COLUMN "total_quantity" DROP NOT NULL;
