/*
  Warnings:

  - Added the required column `supplier_email` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "supplier_email" TEXT NOT NULL;
