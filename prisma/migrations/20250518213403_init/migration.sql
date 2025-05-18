-- CreateEnum
CREATE TYPE "FrequencyType" AS ENUM ('hourly', 'daily');

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "frequency" "FrequencyType" NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_email_key" ON "subscription"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_token_key" ON "subscription"("token");
