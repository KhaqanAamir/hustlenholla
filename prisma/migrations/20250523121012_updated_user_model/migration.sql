/*
  Warnings:

  - The values [PROCESS_MANAGER] on the enum `USER_ROLE` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "USER_ROLE_new" AS ENUM ('SUPER_ADMIN', 'ORGANIZATIONAL_ADMIN', 'PROCESS_MANAGER_WIP', 'PROCESS_MANAGER_FID', 'PROCESS_MANAGER_FINISHING', 'PROCESS_MANAGER_SM', 'EMPLOYEE');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "USER_ROLE_new" USING ("role"::text::"USER_ROLE_new");
ALTER TABLE "InviteLink" ALTER COLUMN "role" TYPE "USER_ROLE_new" USING ("role"::text::"USER_ROLE_new");
ALTER TYPE "USER_ROLE" RENAME TO "USER_ROLE_old";
ALTER TYPE "USER_ROLE_new" RENAME TO "USER_ROLE";
DROP TYPE "USER_ROLE_old";
COMMIT;
