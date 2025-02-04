-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_helath_details" (
    "emp_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "spo2" INTEGER DEFAULT 0,
    "bpm" INTEGER DEFAULT 0,
    "weight" INTEGER DEFAULT 0,
    "height" INTEGER DEFAULT 0,
    "bmi" INTEGER DEFAULT 0,
    "chest" INTEGER DEFAULT 0,
    "waist" INTEGER DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "body_details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_user_helath_details" ("bmi", "body_details", "bpm", "chest", "createdAt", "emp_id", "height", "isDeleted", "name", "spo2", "updatedAt", "waist", "weight") SELECT "bmi", "body_details", "bpm", "chest", "createdAt", "emp_id", "height", "isDeleted", "name", "spo2", "updatedAt", "waist", "weight" FROM "user_helath_details";
DROP TABLE "user_helath_details";
ALTER TABLE "new_user_helath_details" RENAME TO "user_helath_details";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
