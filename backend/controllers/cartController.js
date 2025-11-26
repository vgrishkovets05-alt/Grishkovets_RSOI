import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка получения корзины" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;
        if (!productId) return res.status(400).json({ message: "productId обязателен" });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Товар не найден" });

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existing = cart.items.find(i => i.product.toString() === productId);
        if (existing) {
            existing.quantity += Number(quantity);
        } else {
            cart.items.push({
                product: product._id,
                quantity: Number(quantity),
                price: product.price
            });
        }

        await cart.save();
        await cart.populate("items.product");
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка добавления в корзину" });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        if (!productId || typeof quantity === "undefined") return res.status(400).json({ message: "productId и quantity обязательны" });

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Корзина не найдена" });

        const item = cart.items.find(i => i.product.toString() === productId);
        if (!item) return res.status(404).json({ message: "Товар в корзине не найден" });

        item.quantity = Number(quantity);
        if (item.quantity <= 0) {
            // удалить элемент если количество <= 0
            cart.items = cart.items.filter(i => i.product.toString() !== productId);
        }

        await cart.save();
        await cart.populate("items.product");
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка обновления элемента корзины" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: "productId обязателен" });

        const cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Корзина не найдена" });

        cart.items = cart.items.filter(i => i.product.toString() !== productId);
        await cart.save();
        await cart.populate("items.product");
        res.json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка удаления из корзины" });
    }
};
