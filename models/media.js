const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mediaSchema = new Schema(
  {
    mediaType: {
      // Video or Document
      type: String,
      required: true,
    },
    mediaTitle: {
      type: String,
    },
    fileName: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    mediaPath: {
      type: String,
      required: true,
    },
    mediaDuration: {
      type: String,
    },
    paymentType: {
      type: String,
      required: true,
      default: "paid",
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "course",
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "section",
    },
    mediaOrder: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("media", mediaSchema);
