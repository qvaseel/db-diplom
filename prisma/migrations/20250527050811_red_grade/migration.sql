-- AlterTable
ALTER TABLE "grades" ADD COLUMN     "is_homework" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_passed" BOOLEAN NOT NULL DEFAULT false;
