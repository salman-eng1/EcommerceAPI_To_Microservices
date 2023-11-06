const express = require("express");
const dbConnection = require("./config/database");
const dotenv = require("dotenv");
// const mountRoutes = require("./routes");
const morgan = require("morgan");
dotenv.config(".env");
const globalError = require("./middlewares/errorMiddleware");

// const MessagingService = require("./services/messagingService");

// (async function () {
//   await MessagingService.connect();
//   await MessagingService.declareExchange(
//     process.env.EXCHANGE_NAME,
//     process.env.EXCHANGE_TYPE
//   );
//   await MessagingService.createAndBindQueue(
//     process.env.CONSUMER_QUEUE_NAME,
//     process.env.EXCHANGE_NAME,
//     process.env.CONSUMER_ROUTING_KEY
//   );
//   await MessagingService.consumeMessages(process.env.CONSUMER_QUEUE_NAME);
// })();

dbConnection(process.env.DB_URI);

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new Error(`Can't find this route: ${req.originalUrl}`, 400));
});
app.use(globalError);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
