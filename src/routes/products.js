const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const slugify = require("slugify");
const { Products } = require("../model/products");
const { clientValidation } = require("../utills/validations");
const adminMiddleware = require("../middleware/admin");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// create new product api
router.post("/create-product", adminMiddleware, upload.array("productPictures"), async (req, res) => {
    try {
        const { error } = clientValidation(req.body, "create-product");
        if (error) {
            return res.status(400).send({ status: 400, message: error.details[0].message });
        }

        let availableProduct = await Products.findOne({ title: req.body.title });
        if (availableProduct) {
            return res.status(400).send({ status: 400, message: "Product is available with the same title." });
        }

        let productPictures = [];
        const createdBy = "5fa5335b63a7ce0940c29f2d";
        if (req.files.length > 0) {
            productPictures = req.files.map((item) => {
                return { img: item.filename };
            })
        }

        const newProduct = new Products({
            title: req.body.title,
            slug: slugify(req.body.title),
            price: req.body.price,
            descriptions: req.body.descriptions,
            productPictures: productPictures,
            createdBy: req.user._id,
            categoryId: req.body.categoryId,
            quantity: req.body.quantity,
        });
        await newProduct.save();
        res.status(200).send({ status: 200, message: "new product addedd successfully." });
    } catch (error) {
        console.log(error);
        res.send({ message: "Something went wrong", error: error });
    }

});

module.exports = router;