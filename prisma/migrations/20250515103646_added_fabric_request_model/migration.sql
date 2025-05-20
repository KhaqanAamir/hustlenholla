-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "required_date" DROP DEFAULT;

-- DropEnum
DROP TYPE "Test";

-- CreateTable
CREATE TABLE "Fabric_Request" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "required_date" TIMESTAMP(3) NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,
    "request_details" JSONB NOT NULL,
    "operations" JSONB NOT NULL,
    "total_quantity" INTEGER NOT NULL,

    CONSTRAINT "Fabric_Request_pkey" PRIMARY KEY ("id")
);
