const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/greeting", (req, res) => {
  const resolvedLng = req.resolvedLanguage;
  const response = req.t("greeting");
  res.status(200).json({
    response,
    resolvedLng,
    lang: req.i18n.language,
  });
});

router.get("/no-message", (req, res) => {
  const response = req.t("foo");
  res.status(200);
  res.send(response);
});

const dirname = __dirname.replace("routes", "locales");
const getAllFiles = (dir) => {
  let fileList = [];
  const items = fs.readdirSync(dir);
  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fileList = fileList.concat(getAllFiles(fullPath));
    } else {
      fileList.push("content" + fullPath.replace(dirname, ""));
    }
  });
  return fileList;
};

router.get("/content", (req, res) => {
  const localesPath = path.join(__dirname, "../locales");
  let files = getAllFiles(localesPath);
  if (req.i18n.language.length === 2) {
    files = files.filter((f) => f.includes(req.i18n.language));
  }
  res.status(200).json({
    files,
  });
});

router.get("/content/*", (req, res) => {
  if (req.params[0].length > 1) {
    const filePath = path.join(dirname, req.params[0]);
    try {
      const data = fs.readFileSync(filePath, "utf8");
      res.status(200).json(JSON.parse(data));
    } catch (error) {
      res.status(404).json({ error: "File not found" });
    }
  }
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
