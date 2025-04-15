/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "USER_ROLE" AS ENUM ('SUPER_ADMIN', 'ORGANIZATIONAL_ADMIN', 'PROCESS_MANAGER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "ORDER_CATEGORY" AS ENUM ('ZIPPER', 'ACCESSORIES');

-- CreateEnum
CREATE TYPE "OTP_PURPOSE" AS ENUM ('LOGIN', 'FORGOT_PASSWORD', 'EMAIL_VERIFICATION');

-- CreateEnum
CREATE TYPE "ORDER_STATUS" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ORDER_ITEM_STATUS" AS ENUM ('CUTTING', 'STITCHING', 'WASHING', 'FINISHING', 'PACKAGING', 'DISPATCHED');

-- CreateEnum
CREATE TYPE "DEPARTMENT" AS ENUM ('CUTTING_DEPT', 'STITCHING_DEPT', 'WASHING_DEPT', 'FINISHING_DEPT', 'QUALITY_CONTROL_DEPT', 'PACKAGING_DEPT', 'DISPATCHED_DEPT');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "role" "USER_ROLE" NOT NULL;

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "required_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplier_name" TEXT NOT NULL,
    "supplier_address" TEXT,
    "remarks" TEXT,
    "delivery_period" INTEGER,
    "status" "ORDER_STATUS" NOT NULL DEFAULT 'PENDING',
    "delivery_destination" TEXT NOT NULL,
    "payment_terms" TEXT NOT NULL,
    "freight_terms" TEXT NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "sales_tax" INTEGER NOT NULL DEFAULT 0,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "freight" INTEGER,
    "net_amount" INTEGER NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order_Item" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "item_description" TEXT NOT NULL,
    "item_code" TEXT NOT NULL,
    "additional_specifications" TEXT,
    "status" "ORDER_ITEM_STATUS" NOT NULL DEFAULT 'CUTTING',
    "order_id" INTEGER NOT NULL,
    "category" "ORDER_CATEGORY" NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Order_Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item_Cutting" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3),
    "department" "DEPARTMENT" NOT NULL DEFAULT 'CUTTING_DEPT',
    "worker_id" INTEGER NOT NULL,
    "operations" JSONB NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "order_item_id" INTEGER NOT NULL,

    CONSTRAINT "Item_Cutting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item_Stitching" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3),
    "department" "DEPARTMENT" NOT NULL DEFAULT 'STITCHING_DEPT',
    "worker_id" INTEGER NOT NULL,
    "operations" JSONB NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "order_item_id" INTEGER NOT NULL,

    CONSTRAINT "Item_Stitching_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item_Washing" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3),
    "department" "DEPARTMENT" NOT NULL DEFAULT 'WASHING_DEPT',
    "washing_details" JSONB NOT NULL,
    "operations" JSONB NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "order_item_id" INTEGER NOT NULL,

    CONSTRAINT "Item_Washing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item_Finishing" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3),
    "department" "DEPARTMENT" NOT NULL DEFAULT 'FINISHING_DEPT',
    "finishing_details" JSONB NOT NULL,
    "operations" JSONB NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "order_item_id" INTEGER NOT NULL,

    CONSTRAINT "Item_Finishing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item_Quality_Control" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3),
    "department" "DEPARTMENT" NOT NULL DEFAULT 'QUALITY_CONTROL_DEPT',
    "quality_check_details" JSONB NOT NULL,
    "operations" JSONB NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "order_item_id" INTEGER NOT NULL,

    CONSTRAINT "Item_Quality_Control_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item_Packaging" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3),
    "department" "DEPARTMENT" NOT NULL DEFAULT 'PACKAGING_DEPT',
    "order_details" JSONB NOT NULL,
    "operations" JSONB NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "order_item_id" INTEGER NOT NULL,

    CONSTRAINT "Item_Packaging_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item_Dispatch" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated" TIMESTAMP(3),
    "department" "DEPARTMENT" NOT NULL DEFAULT 'DISPATCHED_DEPT',
    "dispatching_details" JSONB NOT NULL,
    "operations" JSONB NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "order_item_id" INTEGER NOT NULL,

    CONSTRAINT "Item_Dispatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order_Item" ADD CONSTRAINT "Order_Item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Cutting" ADD CONSTRAINT "Item_Cutting_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Cutting" ADD CONSTRAINT "Item_Cutting_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Stitching" ADD CONSTRAINT "Item_Stitching_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Stitching" ADD CONSTRAINT "Item_Stitching_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Washing" ADD CONSTRAINT "Item_Washing_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Finishing" ADD CONSTRAINT "Item_Finishing_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Quality_Control" ADD CONSTRAINT "Item_Quality_Control_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Packaging" ADD CONSTRAINT "Item_Packaging_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Dispatch" ADD CONSTRAINT "Item_Dispatch_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
