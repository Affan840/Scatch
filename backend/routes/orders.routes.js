import { Router } from "express";
import isLoggedIn from "../middlewares/isLoggedIn.middlewares.js";
import { allOrders, orderDetails, placeOrder, placeOrderStripe, updateStatus, userOrders } from "../controllers/order.controllers.js";
const router = Router();

router.get("/", allOrders);

router.get("/myorders", isLoggedIn, userOrders);

router.get("/:id", isLoggedIn, orderDetails);

router.post('/placeorder', isLoggedIn, placeOrder);

router.post('/placeorderstripe', isLoggedIn, placeOrderStripe);

router.post('/status', isLoggedIn, updateStatus);

export default router;