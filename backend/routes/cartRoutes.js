import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getCart, addToCart, updateCartItem, removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

// Все маршруты требуют авторизации
router.use(authMiddleware);

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/update", updateCartItem);
router.post("/remove", removeFromCart);

export default router;
