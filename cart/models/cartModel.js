const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        productId: {
          type: String,
          required: [true, "product id is required"],
        },
        productName: {
          type: String,
          required: [true, "product name is required"],
        },
        imageReference: {
          type: String,
        },

        price: {
          type: Number,
          required: [true, "price is required"],
        },

        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
