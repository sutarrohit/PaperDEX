import { AppError } from "@paperdex/lib";
import { Decimal } from "../../../db/generated/client/runtime/library";

const insufficientBalanceError = (token: string, required: Decimal, available?: Decimal) =>
  new AppError(`Insufficient ${token} balance. Needed: ${required}, Available: ${available || 0}`, 400);

export { insufficientBalanceError };
