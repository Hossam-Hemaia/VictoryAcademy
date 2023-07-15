const sectionServices = require("../services/sectionServices");
const courseServices = require("../services/courseServices");
const mediaServices = require("../services/mediaServices");
const utilities = require("../utilities/utilities");

// SECTIONS CONTROLLERS
exports.postCreateSection = async (req, res, next) => {
  try {
    const {
      sectionTitle,
      sectionType,
      parentSectionId,
      sectionOrder,
      sectionPrice,
    } = req.body;
    const image = req.file;
    let imageUrl;
    if (image) {
      const imagePath = image.path;
      let protocol;
      if (req.get("host").includes("localhost")) {
        protocol = "http";
      } else {
        protocol = "https";
      }
      imageUrl = `${protocol}://${req.get("host")}/${imagePath}`;
    }
    let hasParent = parentSectionId !== "" ? true : false;
    let sectionData;
    if (hasParent) {
      sectionData = {
        sectionTitle,
        sectionType,
        parentSectionId,
        imagePath: imageUrl,
        sectionOrder,
        sectionPrice,
      };
    } else {
      sectionData = {
        sectionTitle,
        sectionType,
        imagePath: imageUrl,
        sectionOrder,
      };
    }
    const sectionCreated = await sectionServices.createSection(sectionData);
    if (sectionCreated) {
      return res
        .status(201)
        .json({ success: true, message: "New Section Created" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllSections = async (req, res, next) => {
  try {
    const sections = await sectionServices.getAllSections();
    res.status(200).json({ success: true, sections: sections });
  } catch (err) {
    next(err);
  }
};

exports.getSectionsByType = async (req, res, next) => {
  try {
    const sectionType = req.query.sectionType;
    const sections = await sectionServices.getSectionsByType(sectionType);
    res.status(200).json({ success: true, sections: sections });
  } catch (err) {
    next(err);
  }
};

exports.getChildSections = async (req, res, next) => {
  try {
    const parentId = req.query.parentId;
    const sections = await sectionServices.getSectionByParentId(parentId);
    res.status(200).json({ success: true, sections: sections });
  } catch (err) {
    next(err);
  }
};

exports.getSection = async (req, res, next) => {
  try {
    const sectionId = req.query.sectionId;
    const section = await sectionServices.getSection(sectionId);
    res.status(200).json({ success: true, section: section });
  } catch (err) {
    next(err);
  }
};

// COURSES CONTROLLERS
exports.postCreateCourse = async (req, res, next) => {
  try {
    const { courseTitle, totalHours, instructorName, endDate, coursePrice } =
      req.body;
    const image = req.file;
    let imageUrl;
    if (image) {
      const imagePath = image.path;
      let protocol;
      if (req.get("host").includes("localhost")) {
        protocol = "http";
      } else {
        protocol = "https";
      }
      imageUrl = `${protocol}://${req.get("host")}/${imagePath}`;
    }
    const courseEndDate = utilities.getLocalEndDate(endDate);
    const courseData = {
      courseTitle,
      totalHours,
      instructorName,
      endDate: courseEndDate,
      courseImage: imageUrl,
      coursePrice,
    };
    const course = await courseServices.createCourse(courseData);
    if (course) {
      return res
        .status(201)
        .json({ success: true, message: "New Course Created" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await courseServices.findAllCourses();
    if (!courses) {
      throw new Error("No courses found!");
    }
    res.status(200).json({ success: true, courses: courses });
  } catch (err) {
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const courseId = req.query.courseId;
    const course = await courseServices.getCourse(courseId);
    res.status(200).json({ success: true, course: course });
  } catch (err) {
    next(err);
  }
};

exports.putEditCourse = async (req, res, next) => {
  try {
    const {
      courseTitle,
      totalHours,
      instructorName,
      endDate,
      coursePrice,
      blockCourse,
      courseId,
    } = req.body;
    const image = req.file;
    let courseImage;
    if (image) {
      courseImage = `${req.protocol}s://${req.get("host")}/${image.path}`;
    }
    const courseData = {
      courseTitle,
      totalHours,
      instructorName,
      endDate,
      courseImage: image ? courseImage : "",
      coursePrice,
      blockCourse,
    };
    await courseServices.editCourse(courseId, courseData);
    res.status(200).json({ success: true, message: "Course Updated" });
  } catch (err) {
    next(err);
  }
};

// MEDIA CONTROLLERS
exports.postUploadMedia = async (req, res, next) => {
  try {
    const {
      mediaType,
      mediaTitle,
      paymentType,
      courseId,
      sectionId,
      mediaOrder,
    } = req.body;
    const file = req.file;
    if (!file) {
      throw new Error("File must be uploaded!");
    }
    let protocol;
    if (req.get("host").includes("localhost")) {
      protocol = "http";
    } else {
      protocol = "https";
    }
    const fileName = file.filename;
    const mediaUrl = `${protocol}://${req.get("host")}/${file.path}`;
    const mediaPath = file.path;
    const mediaDuration = await utilities.getVideoMetaData(mediaPath);
    const mediaData = {
      mediaType,
      mediaTitle,
      fileName,
      mediaUrl,
      mediaPath,
      mediaDuration,
      paymentType,
      courseId,
      sectionId,
      mediaOrder,
    };
    const mediaCreated = await mediaServices.uploadMedia(mediaData);
    if (mediaCreated) {
      return res
        .status(201)
        .json({ success: true, message: "New media added" });
    }
  } catch (err) {
    next(err);
  }
};
