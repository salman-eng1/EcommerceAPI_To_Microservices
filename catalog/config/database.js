const mongoose = require("mongoose");

const dbConnection = (dbURL) => {
  mongoose.connect(dbURL).then((conn) => {
    console.log(`DB connected: ${conn.connection.host}`);
  });
};
module.exports = dbConnection;
