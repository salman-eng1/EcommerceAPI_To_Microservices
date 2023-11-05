const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const CategoryService = require("../../services/categoryService");
const SubCategoryService = require("../../services/subCategoryService");
const ProductService = require("../../services/productService");
const categoryService = new CategoryService();
const subCategoryService = new SubCategoryService();
const productService = new ProductService();

class ProductValidator {
  createProductValidator = [
    check("title")
      .isLength({ min: 3 })
      .withMessage("must be at least 3 chars")
      .notEmpty()
      .withMessage("Product required")
      .custom(async (val, { req }) => {
        //vale is the value of title
        req.body.slug = slugify(val);
        const product = await productService.getProductByKey({
          title: val,
        });

        if (product && product.title === val) {
          throw Error("product already exists");
        } else {
          return true;
        }
      }),

    check("description")
      .notEmpty()
      .withMessage("Product description is required")
      .isLength({ max: 2000 })
      .withMessage("Too long description"),
    check("quantity")
      .notEmpty()
      .withMessage("Product quantity is required")
      .isNumeric()
      .withMessage("Product quantity must be a number"),
    check("sold")
      .optional()
      .isNumeric()
      .withMessage("Product quantity must be a number"),
    check("price")
      .notEmpty()
      .withMessage("Product price is required")
      .isNumeric()
      .withMessage("Product price must be a number")
      .isLength({ max: 32 })
      .withMessage("To long price"),
    check("priceAfterDiscount")
      .optional()
      .isNumeric()
      .withMessage("Product priceAfterDiscount must be a number")
      .toFloat()
      .custom((value, { req }) => {
        if (req.body.price <= value) {
          throw new Error("priceAfterDiscount must be lower than price");
        }
        return true;
      }),

    check("colors")
      .optional()
      .isArray()
      .withMessage("availableColors should be array of string"),
    check("imageCover")
      .notEmpty()
      .withMessage("Product imageCover is required"),
    check("images")
      .optional()
      .isArray()
      .withMessage("images should be array of string"),
    check("category")
      .notEmpty()
      .withMessage("Product must be belong to a category")
      .isMongoId() //it checks only if the id is match the mongo id syntax but doesn't check if it's existed
      .withMessage("Invalid Category ID formate")
      .custom((categoryId) =>
        categoryService.getCategoryById(categoryId).then((category) => {
          if (!category) {
            return Promise.reject(
              new Error(`No category for this id: ${categoryId}`)
            );
          }
        })
      ),

    check("subCategories")
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid subCategory ID formate")
      .custom(
        async (subCategoryIds) =>
          await subCategoryService
            .getSubCategoryByKey({
              _id: { $exists: true, $in: subCategoryIds },
            })
            .then(
              //find will return documents
              (result) => {
                console.log(subCategoryIds.length)
                //result length equal
                if (
                  result.length < 1 ||
                  result.length !== subCategoryIds.length
                ) {
                  return Promise.reject(new Error("invalid subCategory ids"));
                }
              }
            )
      )
      .custom(async (val, { req }) => {
        await subCategoryService
          .getSubCategoryByKey({ category: req.body.category })
          .then((subcategories) => {
            const subCategoriesIdsInDB = [];
            subcategories.forEach((subCategory) => {
              subCategoriesIdsInDB.push(subCategory._id.toString());
            });

            const checker = (target, arr) =>
              target.every((v) => arr.includes(v));
            if (!checker(val, subCategoriesIdsInDB)) {
              return Promise.reject(
                new Error("subCategory doesn't belong to category the ID")
              );
            }
          });
      }),

    check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
    check("ratingsAverage")
      .optional()
      .isNumeric()
      .withMessage("ratingsAverage must be a number")
      .isLength({ min: 1 })
      .withMessage("Rating must be above or equal 1.0")
      .isLength({ max: 5 })
      .withMessage("Rating must be below or equal 5.0"),
    check("ratingsQuantity")
      .optional()
      .isNumeric()
      .withMessage("ratingsQuantity must be a number"),

    validatorMiddleware,
  ];

  getProductValidator = [
    check("id").isMongoId().withMessage("Invalid ID formate"),
    validatorMiddleware,
  ];

  updateProductValidator = [
    check("id").isMongoId().withMessage("Invalid ID formate"),
    body("title")
      .optional()
      .custom(async (val, { req }) => {
        req.body.slug = slugify(val);
        const product = await productService.getProductByKey({
          title: val,
        });

        if (product && product.title === val) {
          throw Error("product already exists");
        } else {
          return true;
        }
      }),
      check("subCategories")
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid subCategory ID formate")
      .custom(
        async (subCategoryIds) =>
          await subCategoryService
            .getSubCategoryByKey({
              _id: { $exists: true, $in: subCategoryIds },
            })
            .then(
              //find will return documents
              (result) => {
                console.log(subCategoryIds.length)
                //result length equal
                if (
                  result.length < 1 ||
                  result.length !== subCategoryIds.length
                ) {
                  return Promise.reject(new Error("invalid subCategory ids"));
                }
              }
            )
      )
      .custom(async (val, { req }) => {
        await subCategoryService
          .getSubCategoryByKey({ category: req.body.category })
          .then((subcategories) => {
            const subCategoriesIdsInDB = [];
            subcategories.forEach((subCategory) => {
              subCategoriesIdsInDB.push(subCategory._id.toString());
            });

            const checker = (target, arr) =>
              target.every((v) => arr.includes(v));
            if (!checker(val, subCategoriesIdsInDB)) {
              return Promise.reject(
                new Error("subCategory doesn't belong to category the ID")
              );
            }
          });
      }),
    validatorMiddleware,
  ];

  deleteProductValidator = [
    check("id").isMongoId().withMessage("Invalid ID formate"),
    validatorMiddleware,
  ];
}

module.exports = ProductValidator;
