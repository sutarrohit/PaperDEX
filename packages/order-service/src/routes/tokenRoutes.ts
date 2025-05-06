import express, { Router } from "express";
import { getTokensLivePrices } from "../controllers/tokenControllers";

const tokenRoutes: Router = express.Router();

tokenRoutes.route("/tokenPrice").get(getTokensLivePrices);

export default tokenRoutes;
