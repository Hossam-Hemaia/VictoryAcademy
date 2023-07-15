const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    imei: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    paidMaterials: [
      { materialType: { type: String }, materialId: { type: String } },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
