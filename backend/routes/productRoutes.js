import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/products — список товаров
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});
// POST /api/products — добавить товар
router.post("/", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ message: "Ошибка при добавлении товара" });
    }
});


export default router;
