const { check, body } = require("express-validator");
const slugify = require("slugify");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const BrandService = require("../../services/brandService");
const brandService = new BrandService();
class BrandValidator {
  getBrandValidator = [
    check("id").isMongoId().withMessage("invalid brand id"),
    validatorMiddleware,
  ];

  createBrandValidator = [
    check("name")
      .notEmpty()
      .withMessage("brand required")
      .isLength({ min: 3 })
      .withMessage("Too short brand name")
      .isLength({ max: 32 })
      .withMessage("Too long brand name")
      .custom(async (val, { req }) => {
        req.body.slug = slugify(val);
        const brand = await brandService.getBrandByKey({
          name: val,
        });

        if (brand && brand.name === val) {
          throw Error("brand already exists");
        } else {
          return true;
        }
      }),
    validatorMiddleware,
  ];

  updateBrandValidator = [
    check("id").isMongoId().withMessage("invalid brand id"),
    body("name")
      .optional()
      .custom(async (val, { req }) => {
        req.body.slug = slugify(val);
        const brand = await brandService.getBrandByKey({
          name: val,
        });

        if (brand && brand.name === val) {
          throw Error("brand already exists");
        } else {
          return true;
            }}),
    validatorMiddleware,
  ];
  deleteBrandValidator = [
    check("id").isMongoId().withMessage("invalid brand id"),
    validatorMiddleware,
  ];
}

module.exports = BrandValidator;
