module.exports = (req, res, next) => {
    console.log(req.user);
    if (req.user.role != "admin") {
        return res.status(403).send({ status: 403, message: "Access denied! You are not authorized person." });
    }
    next();
}