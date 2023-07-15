const Section = require("../models/section");
const Course = require("../models/course");

exports.createSection = async (sectionData) => {
  try {
    const section = new Section(sectionData);
    if (sectionData.sectionType === "prime") {
      await section.save();
      if (section) {
        return true;
      }
    } else if (sectionData.sectionType === "sub") {
      const parentSection = await Section.findById(sectionData.parentSectionId);
      if (parentSection) {
        parentSection.childSections.push(section._id);
        await parentSection.save();
      } else {
        throw new Error("Parent Section Id Is Required!");
      }
      if (section) {
        await section.save();
        return true;
      }
    } else if (sectionData.sectionType === "course") {
      const course = await Course.findById(sectionData.parentSectionId);
      if (course) {
        course.courseSections.push(section._id);
        await course.save();
      } else {
        throw new Error("Course id is required!");
      }
      if (section) {
        await section.save();
        return true;
      }
    }
  } catch (err) {
    throw new Error(err);
  }
};

exports.getAllSections = async () => {
  try {
    const sections = await Section.find();
    return sections;
  } catch (err) {
    throw new Error(err);
  }
};

exports.getSectionsByType = async (sectionType) => {
  try {
    const sections = await Section.find({ sectionType: sectionType })
      .sort({
        sectionOrder: 1,
      })
      .populate(["childSections", "childMedia"]);
    return sections;
  } catch (err) {
    throw new Error(err);
  }
};

exports.getSectionByParentId = async (parentId) => {
  try {
    const sections = await Section.find({ parentSectionId: parentId }).sort({
      sectionOrder: 1,
    });
    return sections;
  } catch (err) {
    next(err);
  }
};

exports.getSection = async (sectionId) => {
  try {
    const section = await Section.findById(sectionId)
      .populate("childSections")
      .populate({
        path: "childMedia",
        select: "-mediaUrl -mediaPath",
      })
      .sort({ sectionOrder: 1 });
    if (!section) {
      throw new Error("Section is not found!");
    }
    return section;
  } catch (err) {
    throw new Error(err);
  }
};
