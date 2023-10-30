const mongoose = require('mongoose');

//create schema
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'Brand existed'],
        required: [true, 'Brand required'],
        minlength: [3, 'Too short Brand name'],
        maxlength: [32, 'Too long Brand name'],
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
      const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
      doc.image = imageUrl;
    }
  };
  //the following code means when the document is stored in db with image name
  // while the image will return url whenever immediatley in the create response
  brandSchema.post("save", (doc) => {
    setImageURL(doc);
  });
  
  //the following code means when the document is stored in db with image name
  // while the image will return url whenever you get the document
  brandSchema.post("init", (doc) => {
    setImageURL(doc);
  });
  
//create mode
module.exports= mongoose.model('Brand', brandSchema);