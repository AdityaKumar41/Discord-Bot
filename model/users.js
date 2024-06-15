const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: String,
  discriminator: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
