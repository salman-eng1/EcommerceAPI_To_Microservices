const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddlware");
const ProductService = require("../services/productService");

// const RabbitMQHandler = require("../utils/amqplib");
// const RabbitMQCon = require("../utils/amqplibCon");
// const amqpURL = process.env.amqpURL;

  //  const connection =async()=>await MessagingService.connect(amqpURL).then( ()=>{
  //   MessagingService.consume('Basket',()=>console.log("listening"))
  //  }).catch((err)=>{
  //   console.log(`connection failed: ${err}`)
  //  });
  //  connection()

// exports.sendMsgToQueue = asyncHandler(async (req, res) => {
//   const product = req.body;
//   if (connection) {
//     // Check if the connection is ready
//     await RabbitMQCon.sendToQueue("Product", JSON.stringify(product));
//   } else {
//     console.error("RabbitMQ connection not ready.");
//   }
// });

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  uploadProductImages = uploadMixOfImages([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]);
  resizeProductImage = asyncHandler(async (req, res, next) => {
    if (req.files.imageCover) {
      const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 2333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${imageCoverFileName}`);

      req.body.imageCover = imageCoverFileName;
    }

    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (img, index) => {
          const imageName = `product-${uuidv4()}-${Date.now()}-${
            index + 1
          }.jpeg`;
          await sharp(img.buffer)
            .resize(2000, 2333)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/products/${imageName}`);

          req.body.images.push(imageName);
        })
      );
    }

    next();
  });

  // @desc     get list of products
  //@route     GET .api/v1/products
  //access     public
  getProducts = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const productsCounts = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(filter), req.query)
      .paginate(productsCounts)
      .filter()
      .search("Product")
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const products = await mongooseQuery;

    res
      .status(200)
      .json({ results: products.length, paginationResult, data: products });
  });

  //build query
  // .populate({ path: "category", select: "name -_id" });

  // @desc     getproductById
  //@route     GET .api/v1/products/:id
  //access     public
  getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = await this.productService.getProductById(id);

    // query = await query.populate(["category","subCategories","brand"]);

    // 2) Execute query
    const product = await query;

    if (!product) {
      return next(new ApiError(`No product for this id ${id}`, 404));
    }
    res.status(200).json({ data: product });
  });

  // async & await used to allow java script to execute the remaining codes before this function is executed to avoid block execution for remaining code
  //asyncHandler is responsible for catching error then send it to expresss
  // req represent incoming request
  //res represent the returend response
  // (Products) is the parameter we pass to the data parameter which represent the response data

  // @desc     createproduct
  //@route     POST .api/v1/products
  //access     private
  createProduct = asyncHandler(async (req, res) => {
    const product = await this.productService.createProduct(req.body);
    res.status(201).json({ data: product });
  });

  // @desc     update specific Products
  //@route     PUT .api/v1/products/:id
  //access     private

  updateProduct = asyncHandler(async (req, res, next) => {
    const product = await this.productService.updateProduct(
      req.params.id,
      req.body
    );

    if (!product) {
      return next(new ApiError(`No product for this id ${req.params.id}`, 404));
    }
    // Trigger "save" event when update product
    product.save();
    res.status(200).json({ data: product });
  });

  // @desc     update specific Products
  //@route     DELETE /api/v1/products/:id
  //access     private

  deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await this.productService.deleteProduct(id);

    if (!product) {
      return next(new ApiError(`No product for this id ${id}`, 404));
    }

    // Trigger "remove" event when update product
    res.status(204).send();
  });
}
module.exports = ProductController;
