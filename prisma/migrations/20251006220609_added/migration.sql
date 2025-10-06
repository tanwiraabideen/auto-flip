/*
  Warnings:

  - Added the required column `mileage` to the `Cars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cars" ADD COLUMN     "mileage" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
