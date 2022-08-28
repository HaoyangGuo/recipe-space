/*
  Warnings:

  - You are about to drop the `RecipesSavedByUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecipesSavedByUsers" DROP CONSTRAINT "RecipesSavedByUsers_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipesSavedByUsers" DROP CONSTRAINT "RecipesSavedByUsers_userId_fkey";

-- DropTable
DROP TABLE "RecipesSavedByUsers";
