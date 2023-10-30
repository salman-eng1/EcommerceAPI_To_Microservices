const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, //remove spaces
      unique: [true, "sub category must be unique"],
      minLength: [2, "too short sub category name"],
      maxlength: [32, "Too long sub category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category", //definde the name of the parent category
      required: [true, "Sub category must belong to parent category"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
