-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_helath_details" (
    "emp_id" TEXT NOT NULL PRIMARY KEY,
    "spo2" INTEGER,
    "bpm" INTEGER,
    "weight" INTEGER,
    "height" INTEGER,
    "bmi" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "body_details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_user_helath_details" ("bmi", "body_details", "bpm", "createdAt", "emp_id", "height", "spo2", "updatedAt", "weight") SELECT "bmi", "body_details", "bpm", "createdAt", "emp_id", "height", "spo2", "updatedAt", "weight" FROM "user_helath_details";
DROP TABLE "user_helath_details";
ALTER TABLE "new_user_helath_details" RENAME TO "user_helath_details";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
