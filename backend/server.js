import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js"; //  добавили импорт

dotenv.config();
console.log("MONGO_URI env value:", process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); //  парсим JSON

// Роуты
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes); //  добавили маршруты для авторизации

// Тестовый маршрут
app.get("/", (req, res) => {
    res.send("Handmade Shop server is working ");
});

// Подключение к MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected");

        // Создаём категории
        const count = await Category.countDocuments();
        if (count === 0) {
            await Category.create({
                name: "Столы",
                description: "Деревянные столы ручной работы"
            });

            await Category.create({
                name: "Разделочные доски",
                description: "Доски для кухни"
            });

            console.log("Test categories created");
        }

        // Создаём пустую корзину для теста
        await Cart.create({
            sessionId: "test-session-123",
            items: []
        });

        console.log("Test cart created");
    })
    .catch((err) => console.error("MongoDB error:", err));


