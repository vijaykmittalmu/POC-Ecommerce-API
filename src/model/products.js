const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    },
    productPictures: [
        {
            img: {
                type: String,
                required: true
            }
        }
    ],
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            review: String
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    offers: [
        {
            offer: {
                type: String,
            }
        }
    ],
    quantity: {
        type: Number,
        required: true
    }
});

exports.Products = mongoose.model("Products", productSchema);