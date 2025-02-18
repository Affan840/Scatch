import { Router } from "express";

import { fetchCart, loginUser, logoutUser, registerUser, updateCart } from "../controllers/user.controllers.js";

const router = Router();

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/logout", logoutUser)

router.post("/updatecart", updateCart)

router.get("/cart/:userId", fetchCart)

export default router;