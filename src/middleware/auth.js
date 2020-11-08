const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).send({ status: 401, message: "Access denied! No token provided" });
    }

    try {
        const decoded = jwt.verify(token, config.get("jwtprivatekey"));
        req.user = decoded;
        next();
    } catch (error) {
        res.send("Invalid Token");
    }
}