import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        if (!token) return res.status(401).json({ message: "Нет токена, авторизация обязательна" });

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload || !payload.id) return res.status(401).json({ message: "Некорректный токен" });

        // можно подгрузить пользователя (необязательно все поля)
        const user = await User.findById(payload.id).select("-password");
        if (!user) return res.status(401).json({ message: "Пользователь не найден" });

        req.user = { id: user._id, email: user.email, name: user.name };
        next();
    } catch (err) {
        console.error("authMiddleware error:", err);
        return res.status(401).json({ message: "Ошибка авторизации" });
    }
};
