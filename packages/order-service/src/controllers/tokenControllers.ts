import { Request, Response, RequestHandler } from "express";
import { TokenPriceStore } from "../store/tokenPriceStore";
import { AppError, catchAsync, getTokenName, tokenInfo } from "@paperdex/lib";

export const getTokenMarketData: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const rawPageIndex = req.query.pageIndex;
  const rawPageSize = req.query.pageSize;

  const pageIndex = rawPageIndex ? parseInt(rawPageIndex as string) : 1;
  const pageSize = rawPageSize ? parseInt(rawPageSize as string) : 10;

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

  res.status(200).json({
    status: "success",
    data: updatedTokenInfo,
    size: tokenInfo.length,
    currentPage: pageIndex,
    pageSize: pageSize,
    totalPages: Math.ceil(tokenInfo.length / pageSize),
  });
});

export const getTokenTradeData: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const tokenName = req.query.token as string;
  if (!tokenName) throw new AppError("Token not found.", 404);

  const filterToken = tokenName.split("_").join("");

  const token = TokenPriceStore.find((token) => token.token === filterToken);
  if (!token) throw new AppError("Token not found.", 404);

  const tokenData = tokenInfo.find((tokenData) => getTokenName(tokenData?.symbol as string) === filterToken);

  const filterData = { ...tokenData, ...token };

  console.log("filterToken===========", filterToken);
  console.log("priceInfo=============>", tokenData);

  res.status(200).json({
    status: "success",
    data: filterData,
  });
});
