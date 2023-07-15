const Media = require("../models/media");
const sectionServices = require("../services/sectionServices");

exports.uploadMedia = async (mediaData) => {
  try {
    const media = new Media(mediaData);
    if (media) {
      const section = await sectionServices.getSection(mediaData.sectionId);
      if (!section) {
        throw new Error("section is not found!");
      }
      section.childMedia.push(media._id);
      await section.save();
    }
    await media.save();
    return true;
  } catch (err) {
    throw new Error(err);
  }
};

exports.getMedia = async (mediaId) => {
  try {
    const media = await Media.findById(mediaId);
    if (!media) {
      throw new Error("Media not found!");
    }
    return media;
  } catch (err) {
    throw new Error(err);
  }
};
