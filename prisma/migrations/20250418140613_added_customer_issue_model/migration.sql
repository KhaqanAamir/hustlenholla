-- CreateTable
CREATE TABLE "Customer_Issue" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_email" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Customer_Issue_pkey" PRIMARY KEY ("id")
);
