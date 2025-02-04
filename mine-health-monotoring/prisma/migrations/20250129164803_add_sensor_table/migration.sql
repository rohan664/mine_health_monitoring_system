-- CreateTable
CREATE TABLE "sensor_information" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "soil_sensor" INTEGER NOT NULL,
    "noise_sensor" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
