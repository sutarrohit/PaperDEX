import { Session } from "@paperdex/user-service";

declare global {
  namespace Express {
    interface Request {
      user?: Session;
    }
  }
}

export {};
