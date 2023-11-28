// API Gateway

const express = require("express");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer();
const app = express();
const dotenv = require("dotenv");

dotenv.config(".env");
const api = "api/v1";
// Route requests to the auth service

app.use(`/${api}/test`, (req, res) => {
  proxy.web(req, res, { target: `http://localhost:5000/${api}/test` });
});

app.use(`/${api}/auth`, (req, res) => {
  proxy.web(req, res, { target: `http://${process.env.AUTH_SERVICE}:3000/${api}/auth` });
});

app.use(`/${api}/users`, (req, res) => {
  proxy.web(req, res, { target: `http://${process.env.AUTH_SERVICE}:3000/${api}/users` });
});

app.use(`/${api}/catalog/products/:productId/reviews`, (req, res) => {
  const { productId } = req.params; // Extract the productId from the request parameters
  const targetURL = `http://${process.env.REVIEW_SERVICE}:3000/${api}/reviews/${productId}/reviews`;

  proxy.web(req, res, { target: targetURL });
});


// Route requests to the product service
app.use(`/${api}/catalog`, (req, res) => {
  proxy.web(req, res, { target: `http://${process.env.CATALOG_SERVICE}:3000/${api}/catalog` });
});


// Route requests to the order service
app.use(`/${api}/cart`, (req, res) => {
  proxy.web(req, res, { target: `http://${process.env.CART_SERVICE}:3000/${api}/cart` });
});
app.use(`/${api}/orders`, (req, res) => {
  proxy.web(req, res, { target: `http://${process.env.ORDER_SERVICE}:3000/${api}/orders` });
});

app.use(`/${api}/coupons`, (req, res) => {
  proxy.web(req, res, { target: `http://${process.env.COUPON_SERVICE}:3000/${api}/coupons` });
});

app.use(`/${api}/reviews`, (req, res) => {
  proxy.web(req, res, { target: `http://${process.env.REVIEW_SERVICE}:3000/${api}/reviews` });
});


// Start the server
const port = process.env.PORT || 2001;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
