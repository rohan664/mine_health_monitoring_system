-- CreateTable
CREATE TABLE "user_helath_details" (
    "emp_id" TEXT NOT NULL PRIMARY KEY,
    "spo2" INTEGER NOT NULL,
    "bpm" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bmi" INTEGER NOT NULL,
    "body_details" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
