const mongoose = require('mongoose');
const MessagingService=require("../services/messagingService")
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'review ratings required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Review must belong to user'],
    },
    // parent reference (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Review must belong to product'],
    },
  },
  { timestamps: true }
);




//it will run any time a review is created
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    // Stage 1 : get all reviews in specific product
    {
      $match: { product: productId },
    },
    // Stage 2: Grouping reviews based on productID and calc avgRatings, ratingsQuantity
    {

      //_id field is used to specify the key by which the documents will be grouped.

      $group: {
        _id: 'product',   
        avgRatings: { $avg: '$ratings' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);



  if (result.length > 0) {
    const message = {
      productId:productId,
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    };

   await MessagingService.publishMessage(
      process.env.EXCHANGE_NAME,
      process.env.CATALOG_ROUTING_KEY,
      message
    );

  } else {
    const message = {
      productId:productId,
      ratingsAverage: 0,
      ratingsQuantity: 0,
    };
    await MessagingService.publishMessage(
      process.env.EXCHANGE_NAME,
      process.env.CATALOG_ROUTING_KEY,
      message
    );
  }

}
//this.constructor refers to the reviewSchema model itself
reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
