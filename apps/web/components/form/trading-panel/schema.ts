import { z } from "zod";

export const TradingPanelSchema = z
  .object({
    side: z.enum(["BUY", "SELL"], {
      required_error: "Order side is required (BUY or SELL)",
    }),
    type: z.enum(["MARKET", "LIMIT"], {
      required_error: "Order type is required (MARKET or LIMIT)",
    }),
    mode: z.enum(["SPOT", "GRID", "FUTURE"], {
      required_error: "Trading mode is required (SPOT, GRID, or FUTURE)",
    }),
    symbol: z.string().min(1, "Symbol is required (e.g., BTC_USDT)"),
    quantity: z.number({ invalid_type_error: "Quantity must be a number" }).positive("Quantity must be greater than 0"),
    price: z
      .number({ invalid_type_error: "Price must be a number" })
      .positive("Price must be greater than 0")
      .nullable(),
    base: z.string(),
    quote: z.string(),
    quantityToken: z.enum(["base", "quote"], {
      required_error: "Select token for quantity",
    }),
  })
  .refine((data) => data.type === "MARKET" || (data.price !== null && data.price > 0), {
    message: "Price is required",
    path: ["price"],
  })
  .transform((data) => {
    const [base, quote] = data.symbol.split("_");
    return { ...data, base, quote };
  });
