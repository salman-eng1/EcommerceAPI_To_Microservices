
const reviewRoute = require("./reviewRoute");

const mountRoutes = (app) => {
    app.use("/api/v1/reviews", reviewRoute);
};

module.exports = mountRoutes;
