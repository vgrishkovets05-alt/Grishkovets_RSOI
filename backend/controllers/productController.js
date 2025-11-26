import Product from "../models/Product.js";

// Получить все товары
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category");
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err });
    }
};

// Получить товар по ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");

        if (!product) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err });
    }
};

// Создать новый товар
export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: "Ошибка при создании товара", error: err });
    }
};

// Обновить товар
export const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!updated) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: "Ошибка при обновлении товара", error: err });
    }
};

// Удалить товар
export const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        res.json({ message: "Товар удалён" });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err });
    }
};
