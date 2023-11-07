const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        productId: {
          type: String,
          required: [true, "product id is required"],
        },

        price: {
          type: Number,
          required: [true, "price is required"],
        },

        quantity: {
          type: Number,
          default: 1,
          min: 0,
        },

        color: String,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
