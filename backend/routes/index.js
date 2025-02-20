import { Router } from "express";
import isLoggedIn from "../middlewares/isLoggedIn.middlewares.js";
import { Product } from "../models/product.model.js";

const router = Router();

router.get("/", isLoggedIn, async (req, res) => {
  if (req.user) {
    return res.status(200).json({ user: req.user });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

export default router;
