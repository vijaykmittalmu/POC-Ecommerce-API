const express = require("express");
const router = express.Router();
const { clientValidation } = require("../utills/validations");
const { Cart } = require("../model/cart");
const adminMiddleware = require("../middleware/admin");

// add to cart api
router.post("/user/add-to-cart", adminMiddleware, async (req, res) => {
    try {
        const { error } = clientValidation(req.body, "add-to-cart");
        if (error) {
            return res.status(400).send({ status: 400, message: error.details[0].message });
        }

        let cartData = await Cart.findOne({ "user": req.user._id });
        if (cartData) {
            const productInCart = cartData.cartItems.find((item) => item.product == req.body.cartItems.product);
            let obj, action, message;
            if (productInCart) {
                obj = { "user": req.user._id, "cartItems.product": req.body.cartItems.product };
                action = {
                    "$set": {
                        "cartItems.$": {
                            ...req.body.cartItems,
                            quantity: productInCart.quantity + req.body.cartItems.quantity
                        }
                    }
                }
                message = "Product already exist in the cart";
            } else {
                obj = { "user": req.user._id };
                action = {
                    "$push": {
                        "cartItems": req.body.cartItems
                    }
                }
                message = "New item added in your cart";
            }

            await Cart.findOneAndUpdate(obj, action);
            res.status(200).send({ status: 200, message: message, cart: req.body.cartItems });
        } else {
            cartData = new Cart({ user: req.user._id, cartItems: [req.body.cartItems] });
            await cartData.save();
            res.status(200).send({ status: 200, message: "Product added in the cart.", cart: cartData });
        }
    } catch (error) {
        console.log(error);
        res.send({ message: "Something went wrong", error: error });
    }
});

module.exports = router;