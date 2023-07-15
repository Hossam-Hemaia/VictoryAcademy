const User = require("../models/user");
const mediaServices = require("../services/mediaServices");
const courseServices = require("../services/courseServices");

exports.getUserByPhoneNumber = async (phoneNumber) => {
  try {
    const user = await User.findOne({ phoneNumber: phoneNumber });
    console.log(user);
    if (user) {
      return user;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error("getUserByPhoneNumber service Error: " + err);
  }
};

exports.createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (phoneNumber, userData) => {
  try {
    const updatedUser = await User.updateOne(
      { phoneNumber: phoneNumber },
      userData
    );
    if (updatedUser) {
      return true;
    }
  } catch (err) {
    throw new Error(err);
  }
};

exports.getUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

exports.checkVideoPayment = async (userId, mediaId) => {
  try {
    const user = await this.getUser(userId);
    const media = await mediaServices.getMedia(mediaId);
    if (media.paymentType === "free") {
      return media;
    } else if (media.paymentType === "paid") {
      const courseId = media.courseId;
      const courseEnded = await courseServices.checkCourseEndDate(courseId);
      if (!courseEnded) {
        throw new Error("Course end date expired!");
      }
      const sectionId = media.sectionId;
      const courseIndex = user.paidMaterials.findIndex((id) => {
        return id.toString() === courseId.toString();
      });
      if (courseIndex > -1) {
        return media;
      }
      const sectionIndex = user.paidMaterials.findIndex((id) => {
        return id.toString() === sectionId.toString();
      });
      if (sectionIndex > -1) {
        return media;
      }
    } else {
      throw new Error("Forbiden! Paid content");
    }
  } catch (err) {
    throw new Error(err);
  }
};
