-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "modelName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Menu_modelName_key" ON "Menu"("modelName");
