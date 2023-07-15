const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sectionSchema = new Schema(
  {
    sectionTitle: {
      type: String,
      required: true,
    },
    sectionType: {
      type: String,
      required: true,
      default: "prime", // select section type [prime or sub or course]
    },
    parentSectionId: {
      type: Schema.Types.ObjectId,
      ref: "section",
    },
    childSections: [{ type: Schema.Types.ObjectId, ref: "section" }],
    childMedia: [{ type: Schema.Types.ObjectId, ref: "media" }],
    imagePath: {
      type: String,
    },
    sectionOrder: {
      type: Number,
    },
    sectionPrice: {
      type: Number,
      default: 0,
    },
    blockSection: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, strictPopulate: false }
);

module.exports = mongoose.model("section", sectionSchema);
