const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseTitle: {
    type: String,
    required: true,
  },
  totalHours: {
    type: Number,
  },
  instructorName: {
    type: String,
  },
  endDate: {
    type: Date,
  },
  courseImage: {
    type: String,
  },
  coursePrice: {
    type: Number,
    default: 0,
  },
  courseSections: [{ type: Schema.Types.ObjectId, ref: "section" }],
  blockCourse: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("course", courseSchema);
