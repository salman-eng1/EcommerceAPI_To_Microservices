// API Gateway

const express = require("express");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer();
const app = express();
const dotenv = require("dotenv");

dotenv.config(".env");
const api = "api/v1";
// Route requests to the auth service
app.use(`/${api}/auth`, (req, res) => {
  proxy.web(req, res, { target: `http://localhost:3000/${api}/auth` });
});

app.use(`/${api}/users`, (req, res) => {
  proxy.web(req, res, { target: `http://localhost:3000/${api}/users` });
});

app.use(`/${api}/catalog/products/:productId/reviews`, (req, res) => {
  const { productId } = req.params; // Extract the productId from the request parameters
  const targetURL = `http://localhost:3005/${api}/reviews/${productId}/reviews`;

  proxy.web(req, res, { target: targetURL });
});


// Route requests to the product service
app.use(`/${api}/catalog`, (req, res) => {
  proxy.web(req, res, { target: `http://localhost:3001/${api}/catalog` });
});


// Route requests to the order service
app.use(`/${api}/cart`, (req, res) => {
  proxy.web(req, res, { target: `http://localhost:3002/${api}/cart` });
});
app.use(`/${api}/orders`, (req, res) => {
  proxy.web(req, res, { target: `http://localhost:3003/${api}/orders` });
});

app.use(`/${api}/coupons`, (req, res) => {
  proxy.web(req, res, { target: `http://localhost:3004/${api}/coupons` });
});

app.use(`/${api}/reviews`, (req, res) => {
  proxy.web(req, res, { target: `http://localhost:3005/${api}/reviews` });
});


// Start the server
const port = process.env.PORT || 2001;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
