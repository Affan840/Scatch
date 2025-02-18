import { Router } from "express";
import upload from "../config/multer.config.js";
import { Product } from "../models/product.model.js";
import { createProduct, deleteAllProducts, deleteProduct } from "../controllers/product.controllers.js";
import  isLogged from "../middlewares/isLoggedIn.middlewares.js";

const router = Router();

router.get("/",async  (req, res) => {
  let products = await Product.find()
  res.status(200).json({ products });
});

router.post("/create", upload.single("image"), createProduct);

router.delete("/delete", deleteAllProducts);

router.delete("/:id", deleteProduct);

export default router;
