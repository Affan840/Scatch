import { Router } from "express";
import isLoggedIn from "../middlewares/isLoggedIn.middlewares.js";
import { Product } from "../models/product.model.js";

const router = Router();

router.get("/", isLoggedIn, async (req, res) => {
  if (req.user) {
    res.status(200).json({ user: req.user });
  }
});

router.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
});

export default router;
