const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const adminServices = require("../services/adminServices");
const userServices = require("../services/userServices");

exports.postCreateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty() && errors.array()[0].msg !== "Invalid value") {
      const errorMsg = new Error(errors.array()[0].msg);
      errorMsg.statusCode = 422;
      throw errorMsg;
    }
    const { clientName, phoneNumber, imei, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const userData = {
      clientName,
      phoneNumber,
      imei,
      password: hashedPassword,
    };
    const user = await userServices.createUser(userData);
    res.status(201).json({ success: true, user: user });
  } catch (err) {
    next(err);
  }
};

exports.postUserLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty() && errors.array()[0].msg !== "Invalid value") {
      const errorMsg = new Error(errors.array()[0].msg);
      errorMsg.statusCode = 422;
      throw errorMsg;
    }
    const user = req.user;
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET,
      { expiresIn: "1Day" }
    );
    res.status(200).json({
      success: true,
      token: token,
      userId: user._id,
      message: "Successfully logged in",
    });
  } catch (err) {
    next(err);
  }
};

exports.postCreateAdmin = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const adminData = { username, role, password: hashedPassword };
    const admin = await adminServices.createAdmin(adminData);
    res.status(201).json({ success: true, admin: admin });
  } catch (err) {
    next(err);
  }
};

exports.postAdminLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty() && errors.array()[0].msg !== "Invalid value") {
      const errorMsg = new Error(errors.array()[0].msg);
      errorMsg.statusCode = 422;
      throw errorMsg;
    }
    const admin = req.admin;
    const token = jwt.sign(
      { adminId: admin._id, role: admin.role },
      process.env.SECRET,
      { expiresIn: "1Day" }
    );
    res.status(200).json({
      success: true,
      token: token,
      adminId: admin._id,
      message: "Successfully logged in",
    });
  } catch (err) {
    next(err);
  }
};

exports.postVerifyPhoneNumber = async (req, res, next) => {
  try {
    const phoneNumber = req.query.phoneNumber;
    const phoneExist = await userServices.getUserByPhoneNumber(phoneNumber);
    if (!phoneExist) {
      throw new Error("Phone number does not exist");
    }
    res.status(200).json({ success: true, message: "Phone number exist" });
  } catch (err) {
    next(err);
  }
};

exports.putResetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty() && errors.array()[0].msg !== "Invalid value") {
      const errorMsg = new Error(errors.array()[0].msg);
      errorMsg.statusCode = 422;
      throw errorMsg;
    }
    const { phoneNumber, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const userData = { password: hashedPassword };
    const updated = await userServices.updateUser(phoneNumber, userData);
    if (!updated) {
      throw new Error("Update Failed!");
    }
    res.status(200).json({ success: true, message: "Updated succeeded!" });
  } catch (err) {
    next(err);
  }
};

exports.postWebHook = async (req, res, next) => {
  try {
    const { headers, body } = req;
    console.log(headers, body);

    const repoPath = "/home/vacademy";
    exec("git pull", { cwd: repoPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing git pull: ${error.message}`);
        return res.status(500).send("Error executing git pull");
      }
      console.log(`Git pull output: ${stdout}`);
      console.error(`Git pull error: ${stderr}`);

      return res.status(200).send("Git pull executed successfully");
    });
  } catch (err) {
    next(err);
  }
};
