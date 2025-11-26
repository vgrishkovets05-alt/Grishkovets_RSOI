import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// CRUD маршруты
router.get("/", getProducts);         // получить все товары
router.get("/:id", getProductById);   // получить товар по id
router.post("/", createProduct);      // создать товар
router.put("/:id", updateProduct);    // обновить товар
router.delete("/:id", deleteProduct); // удалить товар

export default router;

