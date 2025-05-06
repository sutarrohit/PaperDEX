import { Request, Response, RequestHandler } from "express";
import { getTokenPrice } from "../store/tokenPriceStore";
import { catchAsync } from "@paperdex/lib";

export const getTokensLivePrices: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const tokensParam = req.query.tokens;

  let tokens: string[] = [];

  if (typeof tokensParam === "string") {
    tokens = [tokensParam];
  } else if (Array.isArray(tokensParam)) {
    tokens = tokensParam.map((t) => t.toString());
  }

  const tokenPrices = getTokenPrice(tokens);

  res.json({ status: "success", data: tokenPrices });
});
