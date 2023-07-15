const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const compression = require("compression");
const multer = require("multer");
const cors = require("cors-express");

const connectDB = require("./config/dbConnect");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

const app = express();
dotenv.config();

const mongoDB_Uri = `${process.env.Test_DB_URI}`;

const options = {
  allow: {
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
    headers: "Content-Type, Authorization, Accept-Ranges, Range",
  },
  max: {
    age: null,
  },
};

app.use(cors(options));
app.use(compression());

const store = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0];
    if (fileType === "video") {
      cb(null, "videos");
    } else {
      cb(null, "uploads");
    }
  },
  filename: (req, file, cb) => {
    if (file.originalname.length > 50) {
      const error = new Error("File name is too long!");
      cb(error);
    }
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split("/")[1];
  if (
    fileType !== "vnd.microsoft.portable-executable" ||
    fileType !== "octet-stream"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());
app.use(multer({ storage: store, fileFilter: fileFilter }).single("file"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(process.env.api, authRouter);
app.use(process.env.api, adminRouter);
app.use(process.env.api, userRouter);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ success: false, message: message });
});

connectDB.connectDB(mongoDB_Uri);

app.listen(process.env.PORT, "localhost", () => {
  console.log(`listening on port ${process.env.PORT}`);
});
