const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const SubCategoryService = require("../../services/subCategoryService");
const subCategoryService=new SubCategoryService()
//validation process will get the id from the request as calrified in the following rule
class SubCategoryValidator{
  getSubCategoryValidator = [
    check("id").isMongoId().withMessage("invalid subCategory id"),
    validatorMiddleware,
  ];
  
  createSubCategoryValidator = [
    check("name")
      .notEmpty()
      .withMessage("SubCategory required")
      .isLength({ min: 2 })
      .withMessage("Too short subCategory name")
      .isLength({ max: 32 })
      .withMessage("Too long subCategory name")
      .custom(async (val, { req }) => {
        req.body.slug = slugify(val);
        const subCategory = await subCategoryService.getSubCategoryByKey({
          name: val,
        });

        if (subCategory && subCategory.name === val) {
          throw Error("subCategory already exists");
        } else {
          return true;
        }
      }),
    check("category")
      .notEmpty()
      .withMessage("subCategory must belong to parent category")
      .isMongoId()
      .withMessage("invalid category id"),
  
    validatorMiddleware,
  ];
  updateSubCategoryValidator = [
    check("id").isMongoId().withMessage("invalid subCategory id format"),
    body("name").custom(async (val, { req }) => {
      req.body.slug = slugify(val);
      const subCategory = await subCategoryService.getSubCategoryByKey({
        name: val,
      });

      if (subCategory && subCategory.name === val) {
        throw Error("subCategory already exists");
      }else {
        return true;
      }
    }),

    validatorMiddleware,
  ];
  deleteSubCategoryValidator = [
    check("id").isMongoId().withMessage("invalid subCategory id format"),
    validatorMiddleware,
  ];
}

module.exports=SubCategoryValidator