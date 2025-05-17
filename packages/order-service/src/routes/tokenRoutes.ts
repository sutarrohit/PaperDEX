import express, { Router } from "express";
import { getTokenMarketData, getTokenTradeData } from "../controllers/tokenControllers";

const tokenRoutes: Router = express.Router();

tokenRoutes.route("/tokenMarketData").get(getTokenMarketData);
tokenRoutes.route("/tokenTradeData").get(getTokenTradeData);

export default tokenRoutes;
