import express, { Router } from "express";
import { protectedRoute } from "../utils/protectRoute";

const orderRoutes: Router = express.Router();

orderRoutes.route("/currentOrder").get(protectedRoute, (req, res) => {
    res.json({ status: "ok", message: "This is order route" });
});

export default orderRoutes;
