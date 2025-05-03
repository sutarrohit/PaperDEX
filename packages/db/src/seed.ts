import { prisma } from "./client";
import { tradeMarkets } from "./constants/tradeMarkets";

(async () => {
  try {
    console.log("🚀 Database seeding started....");

    await Promise.all(
      tradeMarkets.map((market) =>
        prisma.market.upsert({
          where: {
            symbol: market.symbol,
          },
          update: {
            ...market,
          },
          create: {
            ...market,
          },
        }),
      ),
    );
    console.log("✅ Successfully seeded the database with market data");
  } catch (err) {
    console.error("Error seeding markets:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
