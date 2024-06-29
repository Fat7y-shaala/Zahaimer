const path = require("path");
const express = require("express");
const morgan = require("morgan");

const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const compression = require("compression");
const ApiError = require("./utils/apiError");
const globalError = require("./middleWares/errorMiddleware");
const dbConnection = require("./config/database");

//Routes
const personRoute = require("./routes/personRoutes");
const noteRoute = require("./routes/noteRoute");
const alarmRoute = require("./routes/alarmRoutes");
const patientRoute = require("./routes/patientRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
//const uploadRoute = require("./services/routeUpload");

dotenv.config({ path: "config.env" });
// database connection
dbConnection();

//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

//mount route
app.use("/api/v1/persons", personRoute);
app.use("/api/v1/notes", noteRoute);
app.use("/api/v1/alarms", alarmRoute);
app.use("/api/v1/patients", patientRoute);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
//app.use("/api/v1/users", uploadRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route : ${req.originalUrl}`, 400));
});

// global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 9001;
const server = app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});

// handle rejection for outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("shuting down.....");
    process.exit(1);
  });
});
