console.log("✅ authRoutes.js подключен");

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Регистрация пользователя
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Такой email уже зарегистрирован" });
        }

        const newUser = new User({
            name,
            email,
            password, // НЕ ХЭШИРУЕМ! модель сама захеширует
        });

        await newUser.save();

        res.status(201).json({ message: "Пользователь зарегистрирован" });
    } catch (err) {
        console.error("Ошибка при регистрации:", err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

//  Авторизация пользователя
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Проверяем, существует ли пользователь
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        // Проверяем пароль
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        // Генерируем токен
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            "secretkey",
            { expiresIn: "7d" }
        );

        res.json({
            message: "Успешный вход",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

export default router;
