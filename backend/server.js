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
    .then(() => console.log("MongoDB connected "))
    .catch((err) => console.error("MongoDB error :", err));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT} `));

