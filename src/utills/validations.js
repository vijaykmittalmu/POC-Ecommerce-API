const Joi = require("joi");

// Member Auth Validations
const clientValidation = (obj, type) => {
    switch (type) {
        case "register":
            return Joi.object({
                fname: Joi.string().min(3).max(15).trim().required(),
                lname: Joi.string().min(3).max(15).trim().required(),
                email: Joi.string().email().trim().lowercase().required(),
                password: Joi.string().max(255).required(),
                role: Joi.string().valid("user", "admin")
            }).validate(obj);
        case "signin":
            return Joi.object({
                email: Joi.string().email().trim().lowercase().required(),
                password: Joi.string().max(255).required()
            }).validate(obj);
        case "reset-password":
            return Joi.object({
                email: Joi.string().email().trim().lowercase().required()
            }).validate(obj);
        case "change-password":
            return Joi.object({
                password: Joi.string().max(255).required(),
                token: Joi.string().max(1024).required(),
            }).validate(obj);
        case "create-category":
            return Joi.object({
                name: Joi.string().required(),
                parentId: Joi.string()
            }).validate(obj);
        case "create-product":
            return Joi.object({
                title: Joi.string().required(),
                price: Joi.number().required(),
                descriptions: Joi.string().required(),
                productPictures: Joi.object().keys({
                    img: Joi.string().required()
                }),
                categoryId: Joi.objectId().required(),
                quantity: Joi.number().required(),
            }).validate(obj);
        case "add-to-cart":
            return Joi.object({
                cartItems: Joi.object().keys({
                    product: Joi.objectId().required(),
                    price: Joi.number().required(),
                    quantity: Joi.number().valid(1)
                })
            }).validate(obj);
        default:
            console.log("no found");
            break;
    }
}


// Exports all validations
exports.clientValidation = clientValidation;