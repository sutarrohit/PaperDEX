import express, { Router } from "express";
import { getBalances, getUserAccount, getUserStats } from "../controllers/userControllers";
import { protectedRoute } from "../services/protectRoute";

const userRoutes: Router = express.Router();

userRoutes.route("/account-info").get(protectedRoute, getUserAccount);
userRoutes.route("/account-stats").get(protectedRoute, getUserStats);
userRoutes.route("/token-balance").get(protectedRoute, getBalances);

export default userRoutes;
