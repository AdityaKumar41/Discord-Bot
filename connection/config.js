const mongoose = require("mongoose");

function handleConnection(path) {
  mongoose
    .connect(path, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("MongoDB Connected!");
    });
}

module.exports = handleConnection;
