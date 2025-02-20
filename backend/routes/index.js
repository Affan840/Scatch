import { Router } from "express";
import isLoggedIn from "../middlewares/isLoggedIn.middlewares.js";
import { Product } from "../models/product.model.js";

const router = Router();

router.get("/", isLoggedIn, async (req, res) => {
  if (req.user) {
    res.status(200).json({ user: req.user });
  }
});

export default router;
