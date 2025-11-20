const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const dotenv = require("dotenv");
let AppDebug = false;
try {
  const result = dotenv.config({ silent: true });
  if (result.error) {
    console.log("dotenv result error", result);
    console.error(result.error);
  }
  if (process.env.APPDEBUG && process.env.APPDEBUG.toLowerCase() === "true") {
    AppDebug = true;
    console.log("dotenv config", result.parsed);
  }
} catch (error) {
  console.error("dotenv catch error", error);
}

const connectionString = process.env.MONGO_URL || "";
const dbName = process.env.MONGO_DB || "i18n-express-app";
const mongoose = require("mongoose");
const connect = mongoose.connect(connectionString, {
  useNewUrlParser: true,
});
connect.then(
  (db) => {
    console.log("MongoDB connected correctly to server!");
  },
  (err) => {
    console.log(err);
  }
);

const i18next = require("i18next");
var middleware = require("i18next-http-middleware");
const Backend = require("i18next-node-fs-backend");

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init(
    {
      debug: AppDebug,
      backend: {
        loadPath: path.resolve(__dirname, "./locales/{{lng}}/{{ns}}.json"),
      },
      detection: {
        order: ["querystring", "cookie", "header"],
        caches: ["cookie"],
      },
      saveMissing: true,
      fallbackLng: "en",
      preload: ["en", "es", "fr", "ja", "hi", "mr"],
    },
    (err, t) => {
      if (err) return console.error(err);
      console.log(
        "i18next is ready...",
        t("welcome"),
        t("welcome", { lng: "es" })
      );
    }
  );

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

var app = express();

app.use(middleware.handle(i18next));

app.use(languageMiddleware);
function languageMiddleware(req, res, next) {
  const lang = req.query["lang"] || req.headers["accept-language"] || "en";
  // normalize Accept-Language or ?lang param to just the base locale (e.g. "en")
  const decoded = decodeURIComponent(String(lang));
  const first = decoded.split(",")[0];
  const base = (first.split(/[-;_]/)[0] || "en").toLowerCase();
  req.i18n.changeLanguage(base);
  console.log("languageMiddleware lang:", lang, base, req.query["lang"]);
  next();
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  // res.status(err.status || 500);
  // res.render("error");
  res.status(err.status || 500).json({
    message: err.message,
    time: new Date().toISOString(),
  });
});

module.exports = app;
