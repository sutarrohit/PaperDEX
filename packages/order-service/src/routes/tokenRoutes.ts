import express, { Router } from "express";
import { getOrderBook, getTokenMarketData, getTokenTradeData } from "../controllers/tokenControllers";
import { getTokenPrice } from "../store/tokenPriceStore";

const tokenRoutes: Router = express.Router();

tokenRoutes.route("/tokenMarketData").get(getTokenMarketData);
tokenRoutes.route("/tokenTradeData").get(getTokenTradeData);
tokenRoutes.route("/orderBooks").get(getOrderBook);

tokenRoutes.route("/tokenPrices").get((req, res) => {
  const response = getTokenPrice([]);

  res.json({ status: "success", data: response });
});

export default tokenRoutes;
