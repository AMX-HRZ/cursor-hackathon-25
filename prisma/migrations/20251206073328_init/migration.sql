-- CreateTable
CREATE TABLE "Repair" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fabricType" TEXT NOT NULL,
    "damageType" TEXT NOT NULL,
    "repairStyle" TEXT NOT NULL,
    "snakeScore" INTEGER NOT NULL DEFAULT 0,
    "imageData" TEXT,
    "coordinates" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
