/*
  Warnings:

  - You are about to drop the column `supplier_email` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `customer_email` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "supplier_email",
ADD COLUMN     "customer_email" TEXT NOT NULL;
