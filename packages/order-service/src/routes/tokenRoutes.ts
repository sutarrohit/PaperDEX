import express, { Router } from "express";
import { getTokensLivePrices, getTokenMarketData } from "../controllers/tokenControllers";

const tokenRoutes: Router = express.Router();

tokenRoutes.route("/tokenPrice").get(getTokensLivePrices);
tokenRoutes.route("/tokenMarketData").get(getTokenMarketData);

export default tokenRoutes;
