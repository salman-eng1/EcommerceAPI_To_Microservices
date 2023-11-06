const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
      default: 0,
      min: [0,"this product is not available now"],

    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
      maxlength: [20, "Too long product price"],
      default: 0,
    },
    colors: [String],

    imageCover: {
      type: String,
      // required: [true, "product image cover is required"],
    },
    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      required: [true, "product must belong to category"],
      ref: "Category",
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        required: [true, "product must belong to Sub Category at least"],
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be higher or equal 1.0"],
      max: [5, "Rating must be less or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imageList.push(imageUrl);
    });
    doc.images = imageList;
  }
};
//the following code means when the document is stored in db with image name
// while the image will return url whenever immediatley in the create response
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

//the following code means when the document is stored in db with image name
// while the image will return url whenever you get the document
productSchema.post("init", (doc) => {
  setImageURL(doc);
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    //(this) will be used to refer to the query that is using find
    path: "category",
    select: "name -_id",
  });
  next();
});
module.exports = mongoose.model("Product", productSchema);


