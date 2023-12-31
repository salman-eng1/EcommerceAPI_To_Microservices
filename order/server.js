const express = require("express");
const dbConnection = require("./config/database");
const dotenv = require("dotenv");
const mountRoutes = require("./routes");
const morgan = require("morgan");
dotenv.config(".env");
const globalError = require("./middlewares/errorMiddleware");
const OrderController = require('./controllers/orderController');
const orderController=new OrderController

const MessagingService = require("./services/messagingService");

(async function () {
  await MessagingService.connect();
  await MessagingService.declareExchange(
    process.env.EXCHANGE_NAME,
    process.env.EXCHANGE_TYPE
  );
})();

dbConnection(process.env.DB_URI);

const app = express();
app.use(express.json());
app.use(morgan("dev"));

mountRoutes(app);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  orderController.webhookCheckout
);

app.all("*", (req, res, next) => {
  next(new Error(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(globalError);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
