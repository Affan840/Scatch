import { Router } from "express";
import isLoggedIn from "../middlewares/isLoggedIn.middlewares.js";

import { fetchCart, loginUser, logoutUser, registerUser, updateCart } from "../controllers/user.controllers.js";

const router = Router();

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/logout", logoutUser)

router.post("/updatecart", isLoggedIn, updateCart)

router.get("/cart", isLoggedIn, fetchCart)

export default router;