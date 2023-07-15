const fs = require("fs");
const ffmpeg = require("ffmpeg");

exports.getLocalEndDate = (date) => {
  try {
    const endDate = new Date(date).setHours(23, 59, 59, 0);
    const isoDate = new Date(endDate);
    const localDate = new Date(
      isoDate.getTime() - isoDate.getTimezoneOffset() * 60000
    );
    return localDate;
  } catch (err) {
    throw new Error(err);
  }
};

exports.getLocalDate = (date) => {
  try {
    const newDate = new Date(date).setHourse(0, 0, 0, 0);
    const isoDate = new Date(newDate);
    const localDate = new Date(
      isoDate.getTime() - isoDate.getTimezoneOffset() * 60000
    );
    return localDate;
  } catch (err) {
    throw new Error(err);
  }
};

exports.getVideoMetaData = (filePath) => {
  try {
    return new Promise((resolve, reject) => {
      const process = new ffmpeg(filePath);
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          throw new Error("File does not exist");
        }
      });
      process.then(
        function (video) {
          if (!video) {
            return reject("No media found!");
          }
          const videoLength = video.metadata.duration.raw;
          if (!videoLength || videoLength === "") {
            return resolve("video has no duration");
          }
          return resolve(videoLength);
        },
        function (err) {
          if (err) {
            console.log(err);
            throw err;
          }
        }
      );
    });
  } catch (err) {
    throw new Error(err);
  }
};
