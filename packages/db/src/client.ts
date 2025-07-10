// import { PrismaClient } from "../generated/client";
// import { v4 as uuidv4 } from "uuid";

// const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };
// export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

// const wallet = {
//   create: {
//     id: uuidv4(),
//     balances: {
//       create: [
//         {
//           id: uuidv4(),
//           name: "Tether USD",
//           symbol: "USDT",
//           balance: 10000,
//           icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
//         },
//       ],
//     },
//   },
// };

// // Apply the middleware *after* the instance is potentially created
// prisma.$use(async (params, next) => {
//   if (params.model === "User" && params.action === "create") {
//     // Check if wallet data is already being provided
//     if (!params.args.data?.wallet && !params.args.data?.walletId) {
//       // If not, modify the arguments to include creating a new wallet
//       if (params.args?.data) {
//         params.args.data = {
//           ...params.args.data,
//           wallet: wallet,
//         };
//       } else if (params.args) {
//         // Handle case where args exists but data doesn't (less likely for create)
//         params.args.data = {
//           wallet: wallet,
//         };
//       } else {
//         // Handle case where args itself doesn't exist (very unlikely for create)
//         params.args = {
//           data: {
//             wallet: wallet,
//           },
//         };
//       }
//     }
//   }

//   return next(params);
// });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }

import { PrismaClient } from "../generated/client";
import { v4 as uuidv4 } from "uuid";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };
export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

const wallet = {
  create: {
    id: uuidv4(),
    balances: {
      create: [
        {
          id: uuidv4(),
          name: "Tether USD",
          symbol: "USDT",
          balance: 10000,
          icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
        },
      ],
    },
  },
};

// Apply the middleware *after* the instance is potentially created
prisma.$use(async (params, next) => {
  // Handle User creation
  if (params.model === "User" && params.action === "create") {
    // Check if wallet data is already being provided
    if (!params.args.data?.wallet && !params.args.data?.walletId) {
      // If not, modify the arguments to include creating a new wallet
      if (params.args?.data) {
        params.args.data = {
          ...params.args.data,
          wallet: wallet,
        };
      } else if (params.args) {
        params.args.data = {
          wallet: wallet,
        };
      } else {
        params.args = {
          data: {
            wallet: wallet,
          },
        };
      }
    }

    // Execute the original operation
    const result = await next(params);

    // After user is created, create DailyBalance record
    if (result) {
      await prisma.dailyBalance.create({
        data: {
          id: uuidv4(),
          userId: result.id,
          date: new Date(),
          balance: 10000,
        },
      });
    }

    return result;
  }

  return next(params);
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
