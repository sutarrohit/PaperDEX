import { z } from "zod";

export const OrderSchema = z
  .object({
    side: z.enum(["BUY", "SELL"]),
    type: z.enum(["MARKET", "LIMIT"]),
    mode: z.enum(["SPOT", "FUTURE", "OPTIONS"]),
    symbol: z.string(),
    quantity: z.number().positive(),
    price: z.number().nullable(), // validated conditionally below
  })
  .refine(
    (data) => {
      if (data.type === "MARKET") {
        return data.price === null;
      } else if (data.type === "LIMIT") {
        return typeof data.price === "number";
      }
      return true;
    },
    {
      message: "For MARKET orders, price must be null. For LIMIT orders, price must be a number.",
      path: ["price"], // Point error to the "price" field
    },
  );

export type OrderSchemaType = z.infer<typeof OrderSchema>;
export type OrderWithUserId = OrderSchemaType & { userId: string };
export type OrderWithUserIdANDOrderId = OrderWithUserId & { orderId: string };
