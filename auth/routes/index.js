const userRoute = require("../routes/userRoute");
 const authRoute = require("../routes/authRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
};

module.exports = mountRoutes;
