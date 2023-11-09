const express = require("express");
const dbConnection = require("./config/database");
const dotenv = require("dotenv");
const mountRoutes = require("./routes");
const morgan = require("morgan");
dotenv.config(".env");
const globalError = require("./middlewares/errorMiddleware");
dbConnection(process.env.DB_URI);

const MessagingService = require("./services/messagingService");

(async function () {
  await MessagingService.connect();
  await MessagingService.declareExchange(
    process.env.EXCHANGE_NAME,
    process.env.EXCHANGE_TYPE
  );
})();

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new Error(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(globalError);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
