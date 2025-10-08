/*
  Warnings:

  - Added the required column `timeAddedToDataBase` to the `Cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cars" ADD COLUMN     "timeAddedToDataBase" TIMESTAMP(3) NOT NULL;
