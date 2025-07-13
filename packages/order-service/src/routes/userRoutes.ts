import express, { Router } from "express";
import {
  getBalances,
  getDashboardStats,
  getUserAccount,
  getUserDailyBalance,
  getUserStats,
} from "../controllers/userControllers";
import { protectedRoute } from "../services/protectRoute";

const userRoutes: Router = express.Router();

userRoutes.route("/account-info").get(protectedRoute, getUserAccount);
userRoutes.route("/account-stats").get(protectedRoute, getUserStats);
userRoutes.route("/token-balance").get(protectedRoute, getBalances);
userRoutes.route("/user-daily-balance").get(protectedRoute, getUserDailyBalance);
userRoutes.route("/dashboard-stats").get(protectedRoute, getDashboardStats);

export default userRoutes;
