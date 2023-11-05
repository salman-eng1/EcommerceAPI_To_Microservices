const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      // unique: [true, "product id is unique"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0,"this product is not available now"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
