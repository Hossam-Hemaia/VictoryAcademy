const express = require("express");
const bcrypt = require("bcryptjs");
const authController = require("../controllers/authController");
const adminServices = require("../services/adminServices");
const userServices = require("../services/userServices");
const validator = require("../validator/inputValidator");
const { validatePassword } = require("../validator/inputValidator");

const router = express.Router();

router.post(
  "/create/user",
  [
    validator.validateName,
    validator.validatePhoneNumber.custom(async (value, { req }) => {
      if (req.url === "/create/user") {
        const user = await userServices.getUserByPhoneNumber(value);
        if (user) {
          throw new Error("Phone number is already registered!");
        }
      }
    }),
    validator.validateImei,
    validator.validatePassword,
  ],
  authController.postCreateUser
);

router.post(
  "/login",
  [
    validator.validatePhoneNumber,
    validator.validatePassword.custom(async (value, { req }) => {
      if (req.url === "/login") {
        const user = await userServices.getUserByPhoneNumber(
          req.body.phoneNumber
        );
        if (user) {
          const doMatch = await bcrypt.compare(value, user.password);
          if (!doMatch) {
            throw new Error("Invalid password!");
          }
          const imeiMatch = req.body.imei === user.imei ? true : false;
          if (!imeiMatch) {
            throw new Error("Device is not authorized!");
          }
          req.user = user;
        } else {
          throw new Error("User not found!");
        }
      }
    }),
  ],
  authController.postUserLogin
);

router.post("/create/admin", authController.postCreateAdmin);

router.post(
  "/admin/login",
  [
    validator.validatePassword.custom(async (value, { req }) => {
      if (req.url === "/admin/login") {
        const admin = await adminServices.getAdmin(req.body.username);
        if (admin) {
          const doMatch = await bcrypt.compare(value, admin.password);
          if (!doMatch) {
            throw new Error("Invalid password");
          }
          req.admin = admin;
        } else {
          throw new Error("Admin not found!");
        }
      }
    }),
  ],
  authController.postAdminLogin
);

router.get("/verify/user/phone", authController.postVerifyPhoneNumber);

router.put(
  "/reset/password",
  [
    validatePassword.custom(async (value, { req }) => {
      if (req.url === "/reset/password") {
        if (value !== req.body.confirmPassword) {
          throw new Error("password does not match!");
        }
      }
    }),
  ],
  authController.putResetPassword
);

router.post("/github/webhook", authController.postWebHook);

module.exports = router;
