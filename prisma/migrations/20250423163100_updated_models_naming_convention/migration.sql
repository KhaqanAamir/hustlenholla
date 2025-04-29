/*
  Warnings:

  - You are about to drop the `user_otps` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_otps" DROP CONSTRAINT "user_otps_user_id_fkey";

-- DropTable
DROP TABLE "user_otps";

-- CreateTable
CREATE TABLE "User_Otps" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "otp" TEXT NOT NULL,
    "purpose" "OTP_PURPOSE" NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_Otps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User_Otps" ADD CONSTRAINT "User_Otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
