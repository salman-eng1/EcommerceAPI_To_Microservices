const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const factory = require("../../../../shared/handlers/handlerFactory");
const ApiError = require("../../../../shared/middlewares/apiError");
const { uploadMixOfImages } = require("../../../../shared/middlewares/uploadImageMiddlware");

// const RabbitMQHandler = require("../../../../shared/handlers/amqplib");
const RabbitMQCon = require("../../../../shared/handlers/amqplibCon");


const amqpURL = process.env.amqpURL;

// const rabbitMQHandler = new RabbitMQHandler(amqpURL, "productCreated");
// (async () => {
//   try {
//     rabbitMQHandler.setup();

//     console.log("RabbitMQ connection successfully established");
//   } catch (error) {
//     console.error("Error setting up RabbitMQ connection:", error);
//   }
// })();

   const connection =async()=>await RabbitMQCon.connect(amqpURL, "Product").then( ()=>{
    RabbitMQCon.consume('Product',()=>console.log("received message"))
   }).catch((err)=>{
    console.log(`connection failed: ${err}`)
   });
   connection()



exports.sendMsgToQueue = asyncHandler(async (req, res) => {
  const product = req.body;
  if (connection) {
    // Check if the connection is ready
    await RabbitMQCon.sendToQueue("Product", JSON.stringify(product));
  } else {
    console.error("RabbitMQ connection not ready.");
  }
});


exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 }
]);
exports.resizeProductImage = asyncHandler(async (req, res, next) => {
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
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 2333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageName}`);

        req.body.images.push(imageName);
      })
    );
  }
  console.log(req.body.imageCover);
  console.log(req.body.images);

  next();
});

// @desc     get list of products
//@route     GET .api/v1/products
//access     public
exports.getProducts = factory.getAll(Product, "Products");

//build query
// .populate({ path: "category", select: "name -_id" });

// @desc     getproductById
//@route     GET .api/v1/products/:id
//access     public
exports.getProduct = factory.getOne(Product);

// async & await used to allow java script to execute the remaining codes before this function is executed to avoid block execution for remaining code
//asyncHandler is responsible for catching error then send it to expresss
// req represent incoming request
//res represent the returend response
// (Products) is the parameter we pass to the data parameter which represent the response data

// @desc     createproduct
//@route     POST .api/v1/products
//access     private
exports.createProduct = factory.createOneAndNext(Product);

// @desc     update specific Products
//@route     PUT .api/v1/products/:id
//access     private

exports.updateProduct = factory.updateOne(Product);

// @desc     update specific Products
//@route     DELETE /api/v1/products/:id
//access     private

exports.deleteProduct = factory.deleteOne(Product);
