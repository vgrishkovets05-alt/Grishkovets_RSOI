import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                quantity: { type: Number, default: 1 },
            },
        ],
        totalAmount: { type: Number, required: true },
        status: { type: String, default: "Pending" },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);