import { Router } from "express";
import { allOrders, orderDetails, placeOrder, placeOrderStripe, updateStatus, userOrders } from "../controllers/order.controllers.js";
const router = Router();

router.get("/", allOrders);

router.get("/myorders", userOrders);

router.get("/:id", orderDetails);

router.post('/placeorder', placeOrder);

router.post('/placeorderstripe', placeOrderStripe);

router.post('/status', updateStatus);

export default router;