import { prisma } from "@paperdex/db";
import { AppError, tryCatch } from "@paperdex/lib";
import type { TokenBalance, User, Wallet } from "@paperdex/db";
// or if you have to dig deeper

type UserWithWalletAndBalances = User & {
  wallet: Wallet & {
    balances: TokenBalance[];
  };
};

export const getUserDetails = async (userId: string): Promise<UserWithWalletAndBalances> => {
  const { data, error } = await tryCatch(
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: {
          include: {
            balances: true,
          },
        },
      },
    }),
  );

  if (error || !data || !data.wallet) {
    throw new AppError("User Not Found.", 404);
  }

  return data as UserWithWalletAndBalances;
};
