/*
  Warnings:

  - Added the required column `fileName` to the `Url` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Url" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileSize" DOUBLE PRECISION NOT NULL;
