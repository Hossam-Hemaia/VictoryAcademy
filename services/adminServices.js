const Admin = require("../models/admin");
const Section = require("../models/section");
const Course = require("../models/course");

exports.createAdmin = async (adminData) => {
  try {
    const admin = new Admin(adminData);
    await admin.save();
    return admin;
  } catch (err) {
    next(err);
  }
};

exports.getAdmin = async (username) => {
  try {
    const admin = await Admin.findOne({ username: username });
    if (admin) {
      return admin;
    } else {
      return false;
    }
  } catch (err) {
    next(err);
  }
};
