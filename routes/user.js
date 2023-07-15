const express = require("express");
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const isAuth = require("../validator/isAuth");

const router = express.Router();

router.get(
  "/main/sections",
  isAuth.userIsAuth,
  adminController.getSectionsByType
);

router.get("/get/section", isAuth.userIsAuth, adminController.getSection);

router.get("/courses", isAuth.userIsAuth, userController.getCourses);

router.get("/get/course", isAuth.userIsAuth, userController.getCourse);

router.get(
  "/stream/video",
  isAuth.userIsAuth,
  userController.getStreamVideoFile
);

module.exports = router;
