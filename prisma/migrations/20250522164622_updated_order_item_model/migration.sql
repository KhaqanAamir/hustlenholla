/*
  Warnings:

  - Added the required column `item_image` to the `Order_Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order_Item" ADD COLUMN     "item_image" TEXT NOT NULL;
