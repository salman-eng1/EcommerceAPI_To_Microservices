// const { check, body } = require("express-validator");
// const validatorMiddleware = require("../../middlewares/validatorMiddleware");
// const CartService = require("../../services/cartService");
// const { json } = require("express");

// const cartService=new CartService()



// // class CartValidator {
// //     createCartValidator = [
// //         body('productId')
// //         .isArray()
// //         .withMessage('cartItems must be an array')
// //         .custom((value,{req}) => {
// //             console.log(value)
// //          const product=cartService.getCartById(value)
// //             if (value < 1) {
// //             throw new Error('the product is unavailable currently');
// //           }
// //           // You can access the value of stock and perform additional checks
// //           // based on your requirements
// //           return true; // Validation passed
// //         }),
// //     ];

// // }

// module.exports=CartValidator