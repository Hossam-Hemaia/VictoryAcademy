const fs = require("fs");
const userServices = require("../services/userServices");
const courseServices = require("../services/courseServices");

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await courseServices.findUsersCourses();
    res.status(200).json({ success: true, courses });
  } catch (err) {
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const courseId = req.query.courseId;
    const course = await courseServices.getUserCourse(courseId);
    res.status(200).json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

exports.getStreamVideoFile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const mediaId = req.query.mediaId;
    const media = await userServices.checkVideoPayment(userId, mediaId); //await medaiServices.getMedia(mediaId);
    const fileFormat = media.fileName.split(".")[1];
    const filePath = `./${media.mediaPath}`;
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
    }
    const fileSize = fs.statSync(filePath).size;
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
    const contentLength = end - start + 1;
    const headers = {
      "Transfer-Encoding": "chunked",
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": `video/${fileFormat}`,
    };
    res.writeHead(206, headers);
    const fileStream = fs.createReadStream(filePath, { start, end });
    fileStream.pipe(res);
  } catch (err) {
    next(err);
  }
};
