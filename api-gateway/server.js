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

// Route requests to the product service
app.use(`/${api}/catalog`, (req, res) => {
  proxy.web(req, res, { target: `http://localhost:3001/${api}/catalog` });
});

// Route requests to the order service
app.use(`/${api}/orders`, (req, res) => {
  proxy.web(req, res, { target: `http://localhost:3002/${api}/orders` });
});

// Start the server
const port = process.env.PORT || 2001;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
