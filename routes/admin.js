const express = require("express");
const isAuth = require("../validator/isAuth");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.post(
  "/create/section",
  isAuth.adminIsAuth,
  adminController.postCreateSection
);

router.get("/all/sections", isAuth.adminIsAuth, adminController.getAllSections);

router.get(
  "/sections/type",
  isAuth.adminIsAuth,
  adminController.getSectionsByType
);

router.get(
  "/child/sections",
  isAuth.adminIsAuth,
  adminController.getChildSections
);

router.get("/section/details", isAuth.adminIsAuth, adminController.getSection);

router.post(
  "/create/course",
  isAuth.adminIsAuth,
  adminController.postCreateCourse
);

router.get("/all/courses", isAuth.adminIsAuth, adminController.getAllCourses);

router.get("/course", isAuth.adminIsAuth, adminController.getCourse);

router.put("/edit/course", isAuth.adminIsAuth, adminController.putEditCourse);

router.post(
  "/upload/media",
  isAuth.adminIsAuth,
  adminController.postUploadMedia
);

module.exports = router;
