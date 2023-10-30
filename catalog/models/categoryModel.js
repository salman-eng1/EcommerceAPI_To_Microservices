const mongoose = require("mongoose");

//create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "category existed"],
      required: [true, "Category required"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
//the following code means when the document is stored in db with image name
// while the image will return url  immediately in the create response
categorySchema.post("save", (doc) => {
  setImageURL(doc);
});

//the following code means when the document is stored in db with image name
// while the image will return url whenever you get the document
categorySchema.post("init", (doc) => {
  setImageURL(doc);
});

//create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
