import { Request, Response, RequestHandler } from "express";
import { getTokenPrice, TokenPriceStore } from "../store/tokenPriceStore";
import { catchAsync, getTokenName, tokenInfo } from "@paperdex/lib";

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

export const getTokenMarketData: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const rawPageIndex = req.query.pageIndex;
  const rawPageSize = req.query.pageSize;

  const pageIndex = rawPageIndex ? parseInt(rawPageIndex as string) : 1;
  const pageSize = rawPageSize ? parseInt(rawPageSize as string) : tokenInfo.length;

  let paginatedTokenInfo;

  if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex < 1 || pageSize < 1) {
    paginatedTokenInfo = tokenInfo;
  } else {
    const skip = (pageIndex - 1) * pageSize;
    paginatedTokenInfo = tokenInfo.slice(skip, skip + pageSize);
  }

  // Add price data to tokens
  const updatedTokenInfo = paginatedTokenInfo.map((token) => {
    const priceInfo = TokenPriceStore.find((tokenData) => tokenData.token === getTokenName(token.symbol));

    return {
      ...token,
      price: priceInfo?.price,
      change_1hr: priceInfo?.change_1hr ?? null,
      change_1d: priceInfo?.change_1d ?? null,
      change_1w: priceInfo?.change_1w ?? null,
      market_cap: priceInfo?.market_cap ?? null,
      volume_24hr: priceInfo?.volume_24hr ?? null,
    };
  });

  res.json({
    status: "success",
    data: updatedTokenInfo,
    size: tokenInfo.length,
    currentPage: pageIndex,
    pageSize: pageSize,
    totalPages: Math.ceil(tokenInfo.length / pageSize),
  });
});
