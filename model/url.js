const { Schema, model } = require("mongoose");

const UrlSchema = new Schema(
  {
    urlEncoded: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    visitHistory: [
      { timestamp: { type: Number }, Ipaddress: { type: String } },
    ],
  },
  { timestamps: true }
);

const urlModel = model("urlmodel", UrlSchema);
module.exports = urlModel;
