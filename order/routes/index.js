const orderRoute = require("./orderRoute");


const mountRoutes = (app) => {
  app.use("/api/v1/orders", orderRoute);

};

module.exports = mountRoutes;
