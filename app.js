require("./src/connection");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const config = require("config");
const port = process.PORT || 3000;
const users = require("./src/routes/users");
const category = require("./src/routes/category");
const products = require("./src/routes/products");
const cart = require("./src/routes/cart");
const authMiddleware = require("./src/middleware/auth");

if (!config.get("jwtprivatekey")) {
    console.log("FATAL: jwtprivatekey is not configure");
    process.exit(1)
}

// Middleware
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/ecommerce/", users);
app.use("/api/ecommerce/", authMiddleware, category);
app.use("/api/ecommerce/", authMiddleware, products);
app.use("/api/ecommerce/", authMiddleware, cart);

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});