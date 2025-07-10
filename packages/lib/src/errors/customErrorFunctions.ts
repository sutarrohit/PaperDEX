import { AppError } from "@paperdex/lib";
import { Decimal } from "../../../db/generated/client/runtime/library";

const insufficientBalanceError = (token: string, required: Decimal, available?: Decimal) =>
  new AppError(
    `Insufficient ${token} balance. Needed: ${Number(required)?.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}, Available: ${
      available !== undefined
        ? Number(available)?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : 0
    }`,
    400,
  );

export { insufficientBalanceError };
