const mongoose = require("mongoose");

function handleConnection(path) {
  mongoose.connect(path).then(() => {
    console.log("MongoDB Connected!");
  });
}

module.exports = handleConnection;
