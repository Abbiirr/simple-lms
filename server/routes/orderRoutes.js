import express from "express";
import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";
import addOrder from "../controllers/orderController.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const orders = await Order.find({});
    res.json(orders);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  })
);

router.get(
  "/user/:id",
  asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const order = await Order.find({ userId: userId }).sort({ createdAt: -1 });

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  })
);

router.post("/create", addOrder);

export default router;
