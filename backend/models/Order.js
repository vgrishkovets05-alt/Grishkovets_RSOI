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

        status: {
            type: String,
            enum: ["Pending", "Paid", "Shipped", "Delivered", "Canceled"],
            default: "Pending"
        },

        // сотрудник, который обработал заказ
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        }
    },
    { timestamps: true }
);
