import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcrypt";

import User from "./models/User.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import Cart from "./models/Cart.js";
import Review from "./models/Review.js";

// Загружаем .env из корня проекта
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const seedDatabase = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI);

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI not found in environment variables");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected for seeding");

        // --- Очистка базы ---
        await User.deleteMany({});
        await Product.deleteMany({});
        await Category.deleteMany({});
        await Cart.deleteMany({});
        await Review.deleteMany({});
        console.log("Existing collections cleared");

        // --- Категории ---
        const categories = await Category.insertMany([
            { name: "Столы", description: "Деревянные столы" },
            { name: "Стулья", description: "Деревянные стулья" },
            { name: "Разделочные доски", description: "Кухонные доски" }
        ]);

        // --- Пользователи ---
        const salt = await bcrypt.genSalt(10);
        const users = await User.insertMany([
            { name: "Иван", email: "ivan@example.com", password: await bcrypt.hash("123456", salt), role: "user" },
            { name: "Сергей", email: "sergey@example.com", password: await bcrypt.hash("123456", salt), role: "employee" },
            { name: "Админ", email: "admin@example.com", password: await bcrypt.hash("123456", salt), role: "admin" }
        ]);

        // --- Продукты ---
        const products = await Product.insertMany([
            { title: "Обеденный стол", price: 300, category: categories[0]._id },
            { title: "Кухонный стул", price: 120, category: categories[1]._id },
            { title: "Разделочная доска", price: 40, category: categories[2]._id }
        ]);

        // --- Корзины ---
        await Cart.insertMany([
            { user: users[0]._id, items: [{ product: products[0]._id, quantity: 1 }] },
            { sessionId: "guest-session-1", items: [] }
        ]);

        // --- Отзывы ---
        await Review.insertMany([
            { user: users[0]._id, product: products[0]._id, rating: 5, comment: "Отличный стол!" },
            { user: users[0]._id, product: products[2]._id, rating: 4, comment: "Доска хорошая" }
        ]);

        console.log("Database seeded successfully");
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedDatabase();
