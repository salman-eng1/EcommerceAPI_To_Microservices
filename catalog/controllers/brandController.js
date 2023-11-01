const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const BrandService = require("../services/brandService");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddlware");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
class BrandController {
  constructor() {
    this.brandService = new BrandService();
  }

  //Memory Storage
  uploadBrandImage = uploadSingleImage("image");

  // use memory storage only when you have to process the image
  resizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/brands/${fileName}`);

    req.body.image = fileName;

    next();
  });
  // @desc     get list of brands
  //@route     GET .api/v1/brands
  //access     public
  getBrands = asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const brandsCounts = await Brand.countDocuments();
    const apiFeatures = new ApiFeatures(Brand.find(filter), req.query)
      .paginate(brandsCounts)
      .filter()
      .search("Brand")
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const brands = await mongooseQuery;

    res
      .status(200)
      .json({ results: brands.length, paginationResult, data: brands });
  });

  // @desc     getBrandById
  //@route     GET .api/v1/brands/:id
  //access     public
  getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = this.brandService.getBrandById(id);

    // 2) Execute query
    const brand = await query;

    if (!brand) {
      return next(new ApiError(`No brand for this id ${id}`, 404));
    }
    res.status(200).json({ data: brand });
  });

  // @desc     createBrand
  //@route     POST .api/v1/brands
  //access     private

  createBrand = asyncHandler(async (req, res) => {
    const brand = await this.brandService.createBrand(req.body);
    res.status(201).json({ data: brand });
  });
  // @desc     update specific Brand
  //@route     PUT .api/v1/brands/:id
  //access     private

  updateBrand = asyncHandler(async (req, res, next) => {
    const brand = await this.brandService.updateBrand(req.params.id, req.body);

    if (!brand) {
      return next(new ApiError(`No brand for this id ${req.params.id}`, 404));
    }
    // Trigger "save" event when update brand
    brand.save();
    res.status(200).json({ data: brand });
  });

  // @desc     update specific Brand
  //@route     DELETE /api/v1/brands/:id
  //access     private

  deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await this.brandService.deleteBrand(id);

    if (!brand) {
      return next(new ApiError(`No brand for this id ${id}`, 404));
    }

    // Trigger "remove" event when update brand
    res.status(204).send();
  });
}

module.exports = BrandController;
