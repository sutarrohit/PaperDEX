import { OrderSide } from "@paperdex/db";
import { Decimal } from "../../../db/generated/client/runtime/library";
import { AppError } from "@paperdex/lib";
import { getTokenPrice } from "../store/tokenPriceStore";

type calculateTradeEffects = {
  baseToken: string;
  quoteToken: string;
  side: OrderSide;
  quantity: Decimal;
};

export const calculateTradeEffects = ({ baseToken, quoteToken, side: _side, quantity }: calculateTradeEffects) => {
  try {
    console.log("baseToken, quoteToken, side: _side, quantity", baseToken, quoteToken, _side, quantity);

    if (!baseToken || !quoteToken) throw new AppError("baseToken and quoteToken is not found", 404);

    const baseTokenPrice = new Decimal(getTokenPrice([baseToken])[0]?.price as number);
    const quoteTokenPrice = new Decimal(getTokenPrice([quoteToken])[0]?.price as number);

    if (!baseTokenPrice || !quoteTokenPrice) throw new AppError("Token price data not available", 400);

    quantity = new Decimal(quantity);

    const baseTokenDelta = quantity;
    const quoteTokenDelta = quantity.mul(baseTokenPrice).div(quoteTokenPrice);

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
