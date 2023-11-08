const express = require("express");
const IsAuthenticated=require("../middlewares/isAuthenticated")
const CouponController=require("../controllers/couponController")
const couponController=new CouponController()
const isAuthenticated=new IsAuthenticated()


const router = express.Router();

router.use(isAuthenticated.protectService, isAuthenticated.allowedTo("admin", "manager"));

router.route("/").get(couponController.getCoupons).post(couponController.createCoupon);
router.route("/:id").get(couponController.getCoupon).put(couponController.updateCoupon).delete(couponController.deleteCoupon);

module.exports = router;
