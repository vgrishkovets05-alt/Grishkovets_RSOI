import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";


import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import Category from "./models/Category.js";
import Cart from "./models/Cart.js";
import cartRoutes from "./routes/cartRoutes.js";




dotenv.config();
console.log("MONGO_URI env value:", process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // можно указать конкретный домен
app.use(express.json());

// Роуты
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

// Тестовый маршрут
app.get("/", (req, res) => {
    res.send("Handmade Shop server is working");
});

// Функция для создания тестовых данных
const createTestData = async () => {
    // Создаём категории, если их нет
    const count = await Category.countDocuments();
    if (count === 0) {
        await Category.create([
            { name: "Столы", description: "Деревянные столы ручной работы" },
            { name: "Разделочные доски", description: "Доски для кухни" }
        ]);
        console.log("Test categories created");
    }

    // Создаём тестовую корзину
    const cartCount = await Cart.countDocuments({ sessionId: "test-session-123" });
    if (cartCount === 0) {
        await Cart.create({ sessionId: "test-session-123", items: [] });
        console.log("Test cart created");
    }
};

// Подключение к MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected");
        await createTestData();
    })
    .catch((err) => console.error("MongoDB error:", err));

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
