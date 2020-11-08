const express = require("express");
const _ = require("lodash");
const router = express.Router();
const slugify = require("slugify");
const { clientValidation } = require("../utills/validations");
const { Category } = require("../model/category");
const adminMiddleware = require("../middleware/admin");

function getFormattedCategory(categories, parentId = null) {
    const categoryList = [];
    let categoryArr;
    if (parentId == null) {
        categoryArr = categories.filter((item) => item.parentId == undefined);
    } else {
        categoryArr = categories.filter((item) => item.parentId == parentId);
    }

    for (cat of categoryArr) {
        categoryList.push({
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            childrens: getFormattedCategory(categories, cat._id)
        })
    }
    return categoryList;
}

// create category api
router.post("/create-category", adminMiddleware, async (req, res) => {
    try {
        const { error } = clientValidation(req.body, "create-category");
        if (error) {
            return res.status(400).send({ status: 400, message: error.details[0].message });
        }

        let category = new Category({
            name: req.body.name,
            slug: slugify(req.body.name)
        });

        if (req.body.parentId) {
            category.parentId = req.body.parentId;
        }
        await category.save();

        res.status(200).send({ status: 200, message: "category addedd successfully." });

    } catch (error) {
        console.log(error);
        res.send({ message: "Something went wrong", error: error });
    }
});

// get category api
router.get("/category", async (req, res) => {
    try {
        const categories = await Category.find();
        const result = getFormattedCategory(categories);
        res.status(200).send({ status: 200, data: result });
    } catch (error) {
        console.log(error);
        res.send({ message: "Something went wrong", error: error });
    }
});

module.exports = router;