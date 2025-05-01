import { OrderSide } from "@paperdex/db";
import { Decimal } from "../../../db/generated/client/runtime/library";
import { AppError } from "@paperdex/lib";

type calculateTradeEffects = {
  baseToken: string;
  quoteToken: string;
  side: OrderSide;
  quantity: Decimal;
};

export const calculateTradeEffects = ({ baseToken, quoteToken, side, quantity }: calculateTradeEffects) => {
  try {
    const baseTokenPrice = new Decimal(2500); // TODO: Replace with real API fetch using baseToken
    const quoteTokenPrice = new Decimal(1); // TODO: Replace with real API fetch using quoteToken

    if (!baseTokenPrice || !quoteTokenPrice) throw new AppError("Token price data not available", 400);

    quantity = new Decimal(quantity);

    let baseTokenDelta = quantity;
    let quoteTokenDelta = quantity.mul(baseTokenPrice).div(quoteTokenPrice);

    return {
      baseTokenDelta,
      quoteTokenDelta,
      baseTokenPrice,
      quoteTokenPrice,
    };
  } catch (error) {
    console.log(console.log("calculateTradeEffects error", error));
    throw new AppError("Failed to calculate trade effects", 500);
  }
};
