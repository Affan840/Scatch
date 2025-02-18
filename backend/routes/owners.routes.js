import { Router } from "express";
const router = Router();
import { createOwner, loginOwner } from "../controllers/owner.controllers.js";

router.post("/", loginOwner);
router.post('/create', createOwner);

export default router;