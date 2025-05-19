import express, { Router } from "express";
import { getOrderBook, getTokenMarketData, getTokenTradeData } from "../controllers/tokenControllers";

const tokenRoutes: Router = express.Router();

tokenRoutes.route("/tokenMarketData").get(getTokenMarketData);
tokenRoutes.route("/tokenTradeData").get(getTokenTradeData);
tokenRoutes.route("/orderBooks").get(getOrderBook);

export default tokenRoutes;
