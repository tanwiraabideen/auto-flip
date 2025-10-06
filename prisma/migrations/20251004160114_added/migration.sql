-- CreateTable
CREATE TABLE "Filters" (
    "id" SERIAL NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "minPrice" INTEGER NOT NULL,
    "maxPrice" INTEGER NOT NULL,
    "mileage" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Filters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Filters" ADD CONSTRAINT "Filters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
