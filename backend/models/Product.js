import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
            title: { type: String, required: true },
            description: { type: String },
            price: { type: Number, required: true },
            image: { type: String },

            // Новое поле: ссылка на категорию
            category: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Category",
                    required: false
            }
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);


