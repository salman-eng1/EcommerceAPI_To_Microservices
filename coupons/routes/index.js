
const couponRoute = require("./couponRoute");

const mountRoutes = (app) => {
    app.use("/api/v1/coupons", couponRoute);

};

module.exports = mountRoutes;
