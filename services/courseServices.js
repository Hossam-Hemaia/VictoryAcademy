const Section = require("../models/section");
const Course = require("../models/course");
const utilities = require("../utilities/utilities");

exports.createCourse = async (courseData) => {
  try {
    const course = new Course(courseData);
    await course.save();
    if (course) {
      return true;
    }
  } catch (err) {
    throw new Error(err);
  }
};

exports.findAllCourses = async () => {
  try {
    const courses = await Course.find();
    return courses;
  } catch (err) {
    throw new Error(err);
  }
};

exports.findUsersCourses = async () => {
  try {
    const courses = await Course.find({ blockCourse: false });
    return courses;
  } catch (err) {
    throw new Error(err);
  }
};

exports.getCourse = async (courseId) => {
  try {
    const course = await Course.findById(courseId).populate("courseSections");
    if (!course) {
      throw new Error("Course not found!");
    }
    return course;
  } catch (err) {
    throw new Error(err);
  }
};

exports.getUserCourse = async (courseId) => {
  try {
    const course = await Course.findOne({
      _id: courseId,
      blockCourse: false,
    }).populate("courseSections");
    if (!course) {
      throw new Error("Course is not found");
    }
    return course;
  } catch (err) {
    throw new Error(err);
  }
};

exports.checkCourseEndDate = async (courseId) => {
  try {
    const course = await this.getCourse(courseId);
    const currentDate = new Date();
    const localDate = utilities.getLocalDate(currentDate);
    if (localDate > course.endDate) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    throw new Error(err);
  }
};

exports.editCourse = async (courseId, courseData) => {
  try {
    const updateData = {};
    for (let key in courseData) {
      if (courseData[key] !== "") {
        updateData[key] = courseData[key];
      }
    }
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData);
    if (!updatedCourse) {
      throw new Error("Could not update course!");
    }
    return true;
  } catch (err) {
    throw new Error(err);
  }
};
