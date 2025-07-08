-- CreateTable
CREATE TABLE "daily_balances" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balance" DECIMAL(38,18) NOT NULL,

    CONSTRAINT "daily_balances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_balances_userId_date_key" ON "daily_balances"("userId", "date");

-- AddForeignKey
ALTER TABLE "daily_balances" ADD CONSTRAINT "daily_balances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
