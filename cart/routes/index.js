const cartRoute = require("./cartRoutes");

const mountRoutes = (app) => {
  app.use("/api/v1/cart", cartRoute);
  
};

module.exports = mountRoutes;
