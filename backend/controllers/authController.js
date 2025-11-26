import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ==================== РЕГИСТРАЦИЯ ====================
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Проверка существующего пользователя
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Пользователь уже существует" });
        }

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем пользователя
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.json({ message: "Регистрация успешна", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// ==================== АВТОРИЗАЦИЯ ====================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Проверяем пользователя
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        // Проверяем пароль
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Неверный пароль" });
        }

        // Генерация токена
        const token = jwt.sign(
            { id: user._id },
            "SECRET_KEY", // замени позже на process.env.JWT_SECRET
            { expiresIn: "7d" }
        );

        res.json({
            message: "Вход выполнен успешно",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};
