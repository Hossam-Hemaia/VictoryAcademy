const { body } = require("express-validator");

module.exports = {
  validateName: body("clientName")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("Name must be valid person name!"),
  validatePhoneNumber: body("phoneNumber")
    .trim()
    .isString()
    .notEmpty()
    .isLength({ min: 8, max: 8 })
    .withMessage("Phone Number is required, and must be valid phone number!"),
  validateImei: body("imei")
    .trim()
    .notEmpty()
    .withMessage("IMEI must be provided!"),
  validatePassword: body("password")
    .trim()
    .notEmpty()
    .withMessage("password must be provided!"),
};
