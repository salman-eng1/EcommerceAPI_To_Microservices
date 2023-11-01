const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const CategoryService = require("../../services/categoryService");
const ApiError = require("../apiError");
const categoryService = new CategoryService();
//validation process will get the id from the request as calrified in the following rule
class CategoryValidator {
  getCategoryValidator = [
    check("id").isMongoId().withMessage("invalid category id"),
    validatorMiddleware,
  ];

  createCategoryValidator = [
    check("name")
      .notEmpty()
      .withMessage("Category required")
      .isLength({ min: 3 })
      .withMessage("Too short category name")
      .isLength({ max: 32 })
      .withMessage("Too long category name")
      .custom(async (val, { req }) => {
        req.body.slug = slugify(val);
        const category = await categoryService.getCategoryByKey({
          name: val,
        });

        if (category && category.name === val) {

          throw Error("category exists");
        } else {
          return true;
        }
      }),
    validatorMiddleware,
  ];

  updateCategoryValidator = [
    check("id").isMongoId().withMessage("invalid category id"),
    body("name")
      .optional()
      .custom(async (val, { req }) => {
        req.body.slug = slugify(val);

        const category = await categoryService.getCategoryByKey({
          name: val,
        });

        if (category && category.name === val) {

          throw Error("category exists");
        } else {
          return true;
        }
      }),

    validatorMiddleware,
  ];
  deleteCategoryValidator = [
    check("id").isMongoId().withMessage("invalid category id"),
    validatorMiddleware,
  ];
}
module.exports = CategoryValidator;
