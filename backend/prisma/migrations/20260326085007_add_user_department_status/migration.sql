-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active';
