/*
  Warnings:

  - A unique constraint covering the columns `[order_item_id]` on the table `Item_Cutting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_item_id]` on the table `Item_Dispatch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_item_id]` on the table `Item_Finishing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_item_id]` on the table `Item_Packaging` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_item_id]` on the table `Item_Quality_Control` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_item_id]` on the table `Item_Stitching` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_item_id]` on the table `Item_Washing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Item_Cutting_order_item_id_key" ON "Item_Cutting"("order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Item_Dispatch_order_item_id_key" ON "Item_Dispatch"("order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Item_Finishing_order_item_id_key" ON "Item_Finishing"("order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Item_Packaging_order_item_id_key" ON "Item_Packaging"("order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Item_Quality_Control_order_item_id_key" ON "Item_Quality_Control"("order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Item_Stitching_order_item_id_key" ON "Item_Stitching"("order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "Item_Washing_order_item_id_key" ON "Item_Washing"("order_item_id");
