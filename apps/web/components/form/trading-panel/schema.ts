import { z } from "zod";

export const TradingPanelSchema = z.object({
  side: z.enum(["BUY", "SELL"], {
    required_error: "Order side is required (BUY or SELL)",
  }),
  type: z.enum(["MARKET", "LIMIT"], {
    required_error: "Order type is required (MARKET or LIMIT)",
  }),
  symbol: z.string().min(1, "Symbol is required (e.g., BTCUSDT)"),
  quantity: z.number({ invalid_type_error: "Quantity must be a number" }).positive("Quantity must be greater than 0"),
});
