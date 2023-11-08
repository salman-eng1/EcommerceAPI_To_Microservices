const axios = require("axios");

exports.axiosRequest = async (method, url, token) =>
  await axios({
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
