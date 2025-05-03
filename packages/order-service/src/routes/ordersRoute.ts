import express, { Router } from "express";
import { protectedRoute } from "../services/protectRoute";
import { getAllOrders, getOrder, newOrder, cancelOrder } from "../controllers/orderControllers";
import { TokenPriceStore } from "../store/tokenPriceStore";

const orderRoutes: Router = express.Router();

orderRoutes.route("/allOrders").get(protectedRoute, getAllOrders);
orderRoutes.route("/order").get(protectedRoute, getOrder);
orderRoutes.route("/order").post(protectedRoute, newOrder);
orderRoutes.route("/cancelOrder").post(protectedRoute, cancelOrder);

export default orderRoutes;
