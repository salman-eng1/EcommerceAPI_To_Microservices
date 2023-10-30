// const { v4: uuidv4 } = require("uuid");
// const sharp = require("sharp");
// const asyncHandler = require("express-async-handler");
// const Brand = require("../models/brandModel");
// const factory = require("../../../../shared/handlers/handlerFactory");
// const path = require('path');

// const {
//   uploadSingleImage,
// } = require("../../../../shared/middlewares/uploadImageMiddlware");

// //Memory Storage
// exports.uploadBrandImage = uploadSingleImage("image");

// // use memory storage only when you have to process the image
// exports.resizeImage = asyncHandler(async (req, res, next) => {
//   const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(600, 600)
//     .toFormat("jpeg")
//     .jpeg({ quality: 95 })
//     .toFile(path.join(__dirname, '../../../../shared/uploads/brands/', fileName));

//   req.body.image = fileName;
//   next();
// });
// // @desc     get list of brands
// //@route     GET .api/v1/brands
// //access     public
// exports.getBrands = factory.getAll(Brand);

// // @desc     getBrandById
// //@route     GET .api/v1/brands/:id
// //access     public
// exports.getBrand = factory.getOne(Brand);

// // async & await used to allow java script to execute the remaining codes before this function is executed to avoid block execution for remaining code
// //asyncHandler is responsible for catching error then send it to expresss
// // req represent incoming request
// //res represent the returend response
// // (Brand) is the parameter we pass to the data parameter which represent the response data

// // @desc     createBrand
// //@route     POST .api/v1/brands
// //access     private

// exports.createBrand = factory.createOne(Brand);
// // @desc     update specific Brand
// //@route     PUT .api/v1/brands/:id
// //access     private

// exports.updateBrand = factory.updateOne(Brand);

// // @desc     update specific Brand
// //@route     DELETE /api/v1/brands/:id
// //access     private

// exports.deleteBrand = factory.deleteOne(Brand);
